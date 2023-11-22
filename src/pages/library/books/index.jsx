import {
  Center,
  Flex,
  IconButton,
  Spinner,
  Text,
  Wrap,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  VStack,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { LibraryPageLayout } from 'components/Layouts';
import { FormInputField, SearchInputField } from 'components/Inputs';
import { BiSolidSearchAlt2 } from 'react-icons/bi';
import {
  createBook,
  editBookDetails,
  editQuantity,
  viewBorrowedBooks,
  viewLibrary,
  viewLibraryAsManager
} from 'services/api/queries/library';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAxiosErrorDetail, getOr } from 'utils/objects';
import { bookSearch, iff } from 'utils/helpers';
import { GiCrossMark } from 'react-icons/gi';
import { BookCard } from 'components/Cards';
import { AddBookButton, FilterBooksButton } from 'components/Buttons';
import { useRef, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { get, isEmpty } from 'lodash';
import { errorToast, successToast } from 'utils/toast';
import useUserRoles from 'hooks/useUserRoles';

const Books = () => {
  const { isProprietor, isLibrarian, isBorrower } = useUserRoles();
  const [searchText, setSearchText] = useState('');
  const [isAllBooksQuery, setIsAllBooksQuery] = useState(true);

  const {
    data: viewLibraryResponse,
    isLoading: viewLibraryIsLoading,
    refetch
  } = useQuery({
    enabled: isAllBooksQuery,
    queryKey: ['viewLibrary', isProprietor, isLibrarian, isAllBooksQuery],
    queryFn: isProprietor || isLibrarian ? viewLibraryAsManager : viewLibrary,
    refetchOnWindowFocus: true,
    select: (queryResponse) => {
      const books = getOr(queryResponse, 'data', []);
      return { ...queryResponse, data: searchText ? bookSearch(books, searchText) : books };
    }
  });

  const {
    data: viewBorrowedBooksResponse,
    isLoading: isLoadingBorrowedBooks,
    refetch: refetchBorrowedBooks
  } = useQuery({
    enabled: isBorrower && !isAllBooksQuery,
    queryKey: ['viewBorrowedBooks', isBorrower, isAllBooksQuery],
    queryFn: viewBorrowedBooks,
    refetchOnWindowFocus: true,
    select: (queryResponse) => {
      const books = getOr(queryResponse, 'data', [])
        .filter((book) => !book.returned)
        .map((borrowData) => ({
          borrowData,
          borrow_id: borrowData.id,
          ...borrowData.book
        }));
      return { ...queryResponse, data: searchText ? bookSearch(books, searchText) : books };
    }
  });

  const [selectedEditBook, setSelectedEditBook] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(false);

  const bookList = getOr(
    isAllBooksQuery ? viewLibraryResponse : viewBorrowedBooksResponse,
    'data',
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModalClose = () => {
    setSelectedEditBook(null);
    onClose();
  };

  const handleRefetch = () => {
    refetch();
    refetchBorrowedBooks();
  };

  const formikRef = useRef(null);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const createBookValidationSchema = yup.object().shape({
    title: yup.string().required(),
    author_name: yup.string().required().label('author name'),
    description: yup.string().required(),
    public_shelf_quantity: yup.number().min(0).required().label('public shelf quantity'),
    private_shelf_quantity: yup.number().min(0).required().label('private shelf quantity')
  });

  const editBookDetailsValidationSchema = yup.object().shape({
    id: yup.string().required(),
    title: yup.string().required(),
    author_name: yup.string().required().label('author name'),
    description: yup.string().required()
  });

  const editBookQuantityValidationSchema = yup.object().shape({
    id: yup.string().required(),
    public_shelf_quantity: yup.number().min(0).required().label('public shelf quantity'),
    private_shelf_quantity: yup.number().min(0).required().label('private shelf quantity')
  });

  const { mutate: mutateCreateBook, isPending: mutateCreateBookIsPending } = useMutation({
    mutationFn: createBook,
    mutationKey: 'createBook',
    onSuccess: () => {
      formikRef.current.resetForm();
      handleModalClose();
      handleRefetch();
      successToast({ message: 'book added' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { mutate: mutateEditBookDetails, isPending: mutateEditBookDetailsIsPending } = useMutation({
    mutationFn: editBookDetails,
    mutationKey: 'editBookDetails',
    onSuccess: () => {
      handleRefetch();
      successToast({ message: 'book details edited' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { mutate: mutateEditQuantity, isPending: mutateEditQuantityIsPending } = useMutation({
    mutationFn: editQuantity,
    mutationKey: 'editQuantity',
    onSuccess: () => {
      setEditingQuantity(false);
      handleRefetch();
      successToast({ message: 'book quantity edited' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  return (
    <LibraryPageLayout
      pageTitle="Books"
      searchBar={
        <Flex width="420px" gap="10px">
          <SearchInputField
            containerProps={{ flex: 1 }}
            inputFieldProps={{
              placeholder: 'Search',
              onChange: (e) => setSearchText(e.target.value)
            }}
          />
          <IconButton variant="primary_action" icon={<BiSolidSearchAlt2 />} />
        </Flex>
      }
      showHeroSection>
      {isBorrower || isProprietor ? (
        <Flex gap="12px" marginBottom="10px">
          <FilterBooksButton isActive={isAllBooksQuery} onClick={() => setIsAllBooksQuery(true)}>
            All
          </FilterBooksButton>
          <FilterBooksButton isActive={!isAllBooksQuery} onClick={() => setIsAllBooksQuery(false)}>
            Borrowed
          </FilterBooksButton>
        </Flex>
      ) : (
        ''
      )}
      {iff(
        viewLibraryIsLoading || isLoadingBorrowedBooks,
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>,
        bookList.length === 0 ? (
          <Center height="400px" textStyle="headline-5-medium" flexDirection="column">
            <GiCrossMark />
            <Text>No book found</Text>
          </Center>
        ) : (
          <Wrap spacing="18px">
            {bookList.map((data) => {
              const details = { ...data };
              if (!isProprietor) delete details.private_shelf_quantity;
              if (!isAllBooksQuery) delete details.public_shelf_quantity;
              return (
                <BookCard
                  key={data.id}
                  details={details}
                  isBorrower={isBorrower}
                  isProprietor={isProprietor}
                  isLibrarian={isLibrarian}
                  refetch={handleRefetch}
                  onClickEditBook={() => {
                    setSelectedEditBook(data);
                    onOpen();
                  }}
                  isBorrowView={!isAllBooksQuery}
                />
              );
            })}
            {isProprietor ? <AddBookButton onClick={onOpen} /> : ''}
          </Wrap>
        )
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          handleModalClose();
        }}
        variant="themed">
        <ModalOverlay />
        <Formik
          // innerRef={formikRef}
          innerRef={(ref) => {
            formikRef.current = ref;
          }}
          validationSchema={iff(
            isEmpty(selectedEditBook),
            createBookValidationSchema,
            editingQuantity ? editBookQuantityValidationSchema : editBookDetailsValidationSchema
          )}
          initialValues={
            isEmpty(selectedEditBook)
              ? {
                  title: '',
                  author_name: '',
                  description: '',
                  public_shelf_quantity: '',
                  private_shelf_quantity: ''
                }
              : {
                  id: selectedEditBook.id,
                  title: selectedEditBook.title,
                  author_name: selectedEditBook.author_name,
                  description: selectedEditBook.description,
                  public_shelf_quantity: selectedEditBook.public_shelf_quantity,
                  private_shelf_quantity: selectedEditBook.private_shelf_quantity
                }
          }
          validateOnChange={false}
          onSubmit={(values) => {
            if (isEmpty(selectedEditBook)) {
              mutateCreateBook({
                title: get(values, 'title'),
                author_name: get(values, 'author_name'),
                description: get(values, 'description'),
                public_shelf_quantity: get(values, 'public_shelf_quantity'),
                private_shelf_quantity: get(values, 'private_shelf_quantity')
              });
            } else if (editingQuantity) {
              mutateEditQuantity({
                id: get(values, 'id'),
                public_shelf_quantity: get(values, 'public_shelf_quantity'),
                private_shelf_quantity: get(values, 'private_shelf_quantity')
              });
            } else {
              mutateEditBookDetails({
                id: get(values, 'id'),
                title: get(values, 'title'),
                author_name: get(values, 'author_name'),
                description: get(values, 'description')
              });
            }
          }}
          enableReinitialize>
          {({ values, errors, handleSubmit, setFieldValue }) => (
            <ModalContent maxWidth="600px">
              <ModalHeader>
                <Text>Add book</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <form>
                  <VStack align="stretch" width="100%" spacing="22px">
                    <FormInputField
                      fieldLabel="Title"
                      hasError={get(errors, 'title')}
                      errorText={get(errors, 'title')}
                      inputFieldProps={{
                        name: 'title',
                        placeholder: 'title',
                        type: 'text',
                        variant: 'themed',
                        ref: initialRef,
                        value: get(values, 'title'),
                        onChange: (e) => setFieldValue('title', e.target.value, !isEmpty(errors))
                      }}
                    />
                    <FormInputField
                      fieldLabel="Author name"
                      hasError={get(errors, 'author_name')}
                      errorText={get(errors, 'author_name')}
                      inputFieldProps={{
                        name: 'author_name',
                        placeholder: 'author name',
                        type: 'text',
                        variant: 'themed',
                        value: get(values, 'author_name'),
                        onChange: (e) =>
                          setFieldValue('author_name', e.target.value, !isEmpty(errors)),
                        autoComplete: 'name'
                      }}
                    />
                    <FormInputField
                      fieldLabel="Description"
                      hasError={get(errors, 'description')}
                      errorText={get(errors, 'description')}
                      InputComponent={
                        <Textarea
                          variant="themed"
                          placeholder="description"
                          name="description"
                          value={get(values, 'description')}
                          onChange={(e) =>
                            setFieldValue('description', e.target.value, !isEmpty(errors))
                          }
                          rows={5}
                          borderColor={get(errors, 'description') ? 'red.300' : ''}
                        />
                      }
                    />
                    {!isEmpty(selectedEditBook) ? (
                      <Button
                        variant="primary_action"
                        width="fit-content"
                        marginBottom="20px"
                        onClick={handleSubmit}
                        isLoading={mutateEditBookDetailsIsPending}>
                        Save
                      </Button>
                    ) : (
                      ''
                    )}
                    <Flex>
                      <FormInputField
                        fieldLabel="Public shelf quantity"
                        hasError={get(errors, 'public_shelf_quantity')}
                        errorText={get(errors, 'public_shelf_quantity')}
                        InputComponent={
                          <NumberInput
                            value={get(values, 'public_shelf_quantity')}
                            onChange={(value) =>
                              setFieldValue('public_shelf_quantity', value, !isEmpty(errors))
                            }
                            min={0}
                            clampValueOnBlur={false}
                            variant="themed"
                            isDisabled={!isEmpty(selectedEditBook) && !editingQuantity}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        }
                      />
                      <FormInputField
                        fieldLabel="Private shelf quantity"
                        hasError={get(errors, 'private_shelf_quantity')}
                        errorText={get(errors, 'private_shelf_quantity')}
                        InputComponent={
                          <NumberInput
                            value={get(values, 'private_shelf_quantity')}
                            onChange={(value) =>
                              setFieldValue('private_shelf_quantity', value, !isEmpty(errors))
                            }
                            max={30}
                            clampValueOnBlur={false}
                            variant="themed"
                            isDisabled={!isEmpty(selectedEditBook) && !editingQuantity}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        }
                      />
                    </Flex>
                    {!isEmpty(selectedEditBook) ? (
                      <Button
                        variant="primary_action"
                        width="fit-content"
                        marginBottom="20px"
                        onClick={() => {
                          if (editingQuantity) handleSubmit();
                          else setEditingQuantity(true);
                        }}
                        isLoading={mutateEditQuantityIsPending}>
                        {editingQuantity ? 'Save' : 'Edit'}
                      </Button>
                    ) : (
                      ''
                    )}
                  </VStack>
                </form>
              </ModalBody>
              <ModalFooter>
                {isEmpty(selectedEditBook) ? (
                  <Button
                    variant="primary_action"
                    mr="10px"
                    onClick={handleSubmit}
                    isLoading={mutateCreateBookIsPending}>
                    Create
                  </Button>
                ) : (
                  ''
                )}
                <Button
                  onClick={() => {
                    handleModalClose();
                  }}>
                  {isEmpty(selectedEditBook) ? 'Cancel' : 'Close'}
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </LibraryPageLayout>
  );
};

export default Books;

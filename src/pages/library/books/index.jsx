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
import { createBook, viewLibrary, viewLibraryAsManager } from 'services/api/queries/library';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAxiosErrorDetail, getOr } from 'utils/objects';
import { iff } from 'utils/helpers';
import { GiCrossMark } from 'react-icons/gi';
import { BookCard } from 'components/Cards';
import { AddBookButton } from 'components/Buttons';
import { useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { get, isEmpty } from 'lodash';
import { errorToast, successToast } from 'utils/toast';
import useUserRoles from 'hooks/useUserRoles';

const Books = () => {
  const { isProprietor, isLibrarian } = useUserRoles();
  const {
    data: viewLibraryResponse,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['viewLibrary', isProprietor, isLibrarian],
    queryFn: isProprietor || isLibrarian ? viewLibraryAsManager : viewLibrary,
    refetchOnWindowFocus: true
  });

  const libraryBooks = getOr(viewLibraryResponse, 'data', []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const formikRef = useRef(null);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const passwordValidationSchema = yup.object().shape({
    title: yup.string().required(),
    author_name: yup.string().required().label('author name'),
    description: yup.string().required(),
    public_shelf_quantity: yup.number().min(0).required().label('public shelf quantity'),
    private_shelf_quantity: yup.number().min(0).required().label('private shelf quantity')
  });

  const { mutate: mutateCreateBook, isPending: mutateCreateBookIsPending } = useMutation({
    mutationFn: createBook,
    mutationKey: 'createBook',
    onSuccess: () => {
      formikRef.current.resetForm();
      onClose();
      refetch();
      successToast({ message: 'book added' });
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
              placeholder: 'Search'
            }}
          />
          <IconButton variant="primary_action" icon={<BiSolidSearchAlt2 />} />
        </Flex>
      }
      showHeroSection>
      {iff(
        isLoading,
        <Center height="400px">
          <Spinner color="primary.500" />
        </Center>,
        libraryBooks.length === 0 ? (
          <Center height="400px" textStyle="headline-5-medium" flexDirection="column">
            <GiCrossMark />
            <Text>No book found</Text>
          </Center>
        ) : (
          <Wrap spacing="18px">
            {getOr(viewLibraryResponse, 'data', []).map((data) => {
              const details = { ...data };
              if (!isProprietor) delete details.private_shelf_quantity;
              return <BookCard key={data.id} {...details} />;
            })}
            {isProprietor ? <AddBookButton onClick={onOpen} /> : ''}
          </Wrap>
        )
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        variant="themed">
        <ModalOverlay />
        <Formik
          innerRef={formikRef}
          validationSchema={passwordValidationSchema}
          initialValues={{
            title: '',
            author_name: '',
            description: '',
            public_shelf_quantity: '',
            private_shelf_quantity: ''
          }}
          validateOnChange={false}
          onSubmit={(values) => {
            mutateCreateBook({
              title: get(values, 'title'),
              author_name: get(values, 'author_name'),
              current_password: get(values, 'current_password'),
              description: get(values, 'description'),
              public_shelf_quantity: get(values, 'public_shelf_quantity'),
              private_shelf_quantity: get(values, 'private_shelf_quantity')
            });
          }}>
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
                          rows={10}
                          borderColor={get(errors, 'description') ? 'red.300' : ''}
                        />
                      }
                    />
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
                            variant="themed">
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
                            variant="themed">
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        }
                      />
                    </Flex>
                  </VStack>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="primary_action"
                  mr="10px"
                  onClick={handleSubmit}
                  isLoading={mutateCreateBookIsPending}>
                  Create
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </LibraryPageLayout>
  );
};

export default Books;

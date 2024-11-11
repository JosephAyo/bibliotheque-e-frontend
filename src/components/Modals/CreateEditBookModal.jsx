import { createBook, editBookDetails, editQuantity } from '@/services/api/queries/library';
import { iff } from '@/utils/helpers';
import { getAxiosErrorDetail, getOr } from '@/utils/objects';
import { errorToast, successToast } from '@/utils/toast';
import {
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import * as yup from 'yup';
import { ImageUpload } from '../Cards';
import { FormInputField } from '../Inputs';
import { Select } from 'chakra-react-select';
import useGenreContext from '@/hooks/useGenreContext';

const CreateEditBookModal = ({ selectedBook, isOpen, onClose, refetch }) => {
  const genres = useGenreContext();

  const formikRef = useRef(null);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [editingQuantity, setEditingQuantity] = useState(false);

  const createBookValidationSchema = yup.object().shape({
    img_url: yup.string().required(),
    title: yup.string().required(),
    author_name: yup.string().required().label('author name'),
    description: yup.string().required(),
    public_shelf_quantity: yup.number().min(0).required().label('public shelf quantity'),
    private_shelf_quantity: yup.number().min(0).required().label('private shelf quantity'),
    genres: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required()
        })
      )
      .min(1)
      .label('genre')
  });

  const editBookDetailsValidationSchema = yup.object().shape({
    img_url: yup.string().required(),
    id: yup.string().required(),
    title: yup.string().required(),
    author_name: yup.string().required().label('author name'),
    description: yup.string().required(),
    genres: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required()
        })
      )
      .min(1)
      .label('genre')
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
      refetch();
      onClose();
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
      refetch();
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
      refetch();
      successToast({ message: 'book quantity edited' });
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const isInCreatingMode = isEmpty(selectedBook);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      variant="themed">
      <ModalOverlay />
      <Formik
        innerRef={(ref) => {
          formikRef.current = ref;
        }}
        validationSchema={iff(
          isInCreatingMode,
          createBookValidationSchema,
          editingQuantity ? editBookQuantityValidationSchema : editBookDetailsValidationSchema
        )}
        initialValues={
          isInCreatingMode
            ? {
                title: '',
                author_name: '',
                description: '',
                img_url: '',
                public_shelf_quantity: '',
                private_shelf_quantity: '',
                genres: []
              }
            : {
                id: selectedBook.id,
                title: selectedBook.title,
                author_name: selectedBook.author_name,
                description: selectedBook.description,
                img_url: selectedBook.img_url,
                public_shelf_quantity: selectedBook.public_shelf_quantity,
                private_shelf_quantity: selectedBook.private_shelf_quantity,
                genres: getOr(selectedBook, 'genre_associations', []).map((item) => ({
                  value: item.genre.id,
                  label: item.genre.name
                }))
              }
        }
        validateOnChange={false}
        onSubmit={(values) => {
          if (isInCreatingMode) {
            mutateCreateBook({
              title: get(values, 'title'),
              author_name: get(values, 'author_name'),
              description: get(values, 'description'),
              img_url: get(values, 'img_url'),
              public_shelf_quantity: get(values, 'public_shelf_quantity'),
              private_shelf_quantity: get(values, 'private_shelf_quantity'),
              genre_ids: get(values, 'genres', []).map((item) => item.value)
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
              description: get(values, 'description'),
              img_url: get(values, 'img_url'),
              genre_ids: get(values, 'genres', []).map((item) => item.value)
            });
          }
        }}
        enableReinitialize>
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <ModalContent maxWidth="600px">
            <ModalHeader>
              <Text>{isInCreatingMode ? 'Add' : 'Edit'} book</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form>
                <VStack align="stretch" width="100%" spacing="22px">
                  <ImageUpload
                    formImgUrl={get(values, 'img_url')}
                    onUploadComplete={(value) => setFieldValue('img_url', value, !isEmpty(errors))}
                  />
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
                  <FormInputField
                    fieldLabel="Genres"
                    hasError={get(errors, 'genres')}
                    errorText={get(errors, 'genres')}
                    InputComponent={
                      <Select
                        isMulti
                        placeholder="Select genres"
                        value={get(values, 'genres')}
                        onChange={(value) => setFieldValue('genres', value, !isEmpty(errors))}
                        options={genres}
                        closeMenuOnSelect={false}
                      />
                    }
                  />
                  {!isInCreatingMode ? (
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
                          isDisabled={!isInCreatingMode && !editingQuantity}>
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
                          isDisabled={!isInCreatingMode && !editingQuantity}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      }
                    />
                  </Flex>
                  {!isInCreatingMode ? (
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
              {isInCreatingMode ? (
                <Button
                  variant="primary_action"
                  mr="10px"
                  onClick={handleSubmit}
                  isLoading={mutateCreateBookIsPending}
                  isDisabled={!isEmpty(errors)}>
                  Create
                </Button>
              ) : (
                ''
              )}
              <Button
                onClick={() => {
                  onClose();
                }}>
                {isInCreatingMode ? 'Cancel' : 'Close'}
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateEditBookModal;

import { viewLibraryAsManager } from '@/services/api/queries/library';
import { getAxiosErrorDetail, getAxiosResponseBody, getOr } from '@/utils/objects';
import { errorToast, successToast } from '@/utils/toast';
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Wrap
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import { get, isEmpty } from 'lodash';
import * as yup from 'yup';
import { FormInputField } from '../Inputs';
import curationTableAndEditorLayout from '../TableDataLayout/curation';
import { createCuration, editCuration } from '@/services/api/queries/curation';

const CreateEditCurationModal = ({ selectedCuration, onClose, refetch }) => {
  const { data: booksOptions } = useQuery({
    queryKey: [`getBooksOptions`],
    queryFn: viewLibraryAsManager,
    refetchOnWindowFocus: true,
    placeholderData: [],
    select: (queryResponse) => {
      const books = getOr(queryResponse, 'data', []);
      return books.map((book) => ({
        value: book.id,
        label: `${book.title} | ${book.author_name}`
      }));
    }
  });

  const { mutate: mutateEditCuration, isPending: mutateEditCurationIsPending } = useMutation({
    mutationFn: editCuration,
    mutationKey: 'editCuration',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
      onClose();
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const { mutate: mutateCreateCuration, isPending: mutateCreateCurationIsPending } = useMutation({
    mutationFn: createCuration,
    mutationKey: 'createCuration',
    onSuccess: (response) => {
      successToast({ message: get(getAxiosResponseBody(response), 'detail', '') });
      refetch();
      onClose();
    },
    onError: (error) => {
      errorToast({ message: getAxiosErrorDetail(error) });
    }
  });

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    published: yup.boolean().required(),
    book_ids: yup
      .array(
        yup.object().shape({
          value: yup.string().required()
        })
      )
      .min(1, 'at least 1 book must be selected')
  });

  return (
    <Modal isOpen={!isEmpty(selectedCuration)} onClose={onClose} variant="themed">
      <ModalOverlay />
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          id: get(selectedCuration, 'id', null),
          title: get(selectedCuration, 'title'),
          description: get(selectedCuration, 'description', ''),
          published: get(selectedCuration, 'published', false),
          book_ids: get(selectedCuration, 'book_ids', [])
        }}
        validateOnChange={false}
        onSubmit={(values) => {
          if (values.id)
            mutateEditCuration({
              id: get(selectedCuration, 'id'),
              title: get(values, 'title'),
              description: get(values, 'description'),
              published: get(values, 'published'),
              book_ids: get(values, 'book_ids').map((selection) => selection.value)
            });
          else
            mutateCreateCuration({
              title: get(values, 'title'),
              description: get(values, 'description'),
              published: get(values, 'published'),
              book_ids: get(values, 'book_ids').map((selection) => selection.value)
            });
        }}>
        {({ values: formValues, errors, handleSubmit, setFieldValue, dirty, submitCount }) => (
          <form onSubmit={handleSubmit}>
            <ModalContent maxWidth="600px">
              <ModalHeader>
                <Text>Curation</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Wrap width="100%" spacing="20px">
                  {curationTableAndEditorLayout
                    .filter((col) => col.key !== 'action' && col.editable)
                    .map((col) => {
                      if (col.renderEditor)
                        return col.renderEditor(
                          get(formValues, col.key),
                          get(errors, col.key),
                          (value) => setFieldValue(col.key, value, submitCount > 0),
                          {
                            booksOptions
                          }
                        );
                      return (
                        <FormInputField
                          key={col.key}
                          fieldLabel={col.label}
                          hasError={get(errors, col.key)}
                          errorText={get(errors, col.key)}
                          inputFieldProps={{
                            name: `curation-${col.key}`,
                            placeholder: col.key,
                            type: col.key,
                            variant: 'plain',
                            value: get(formValues, col.key),
                            onChange: (e) => setFieldValue(col.key, e.target.value, submitCount > 0)
                          }}
                        />
                      );
                    })}
                </Wrap>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="primary_action"
                  mr="10px"
                  onClick={handleSubmit}
                  isLoading={mutateEditCurationIsPending || mutateCreateCurationIsPending}
                  isDisabled={!dirty}
                  type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateEditCurationModal;

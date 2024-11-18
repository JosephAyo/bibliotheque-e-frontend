import { Box, IconButton, Switch, Tag, Textarea } from '@chakra-ui/react';
import Link from 'next/link';
import { FormInputField } from '../Inputs';
import { Select } from 'chakra-react-select';
import { FaEdit } from 'react-icons/fa';
import { USER_ROLES } from '@/utils/constants';

const curationTableAndEditorLayout = [
  {
    key: 'title',
    label: 'Title',
    path: 'title',
    editable: true,
    render: (curation, title) => (
      <Link href={`/curations/${curation.id}`}>
        <Box
          as="span"
          _hover={{
            textDecorationLine: 'underline'
          }}>
          {title}
        </Box>
      </Link>
    )
  },
  {
    key: 'description',
    label: 'Description',
    path: 'description',
    editable: true,
    renderEditor: (value, error, onChange) => (
      <FormInputField
        fieldLabel="Description"
        hasError={error}
        errorText={error}
        InputComponent={
          <Textarea
            value={value}
            placeholder="Description"
            onChange={(e) => onChange(e.target.value)}
          />
        }
      />
    )
  },
  {
    key: 'book_ids',
    label: 'Books',
    path: 'book_ids',
    editable: true,
    hideInTable: true,
    renderEditor: (selection, error, onChange, { booksOptions }) => (
      <FormInputField
        fieldLabel="Books"
        hasError={error}
        errorText={error}
        InputComponent={
          <Select
            isMulti
            placeholder="Select books"
            value={selection}
            onChange={(value) => onChange(value)}
            options={booksOptions}
            closeMenuOnSelect={false}
            styles={{
              container: {
                width: '100%'
              }
            }}
          />
        }
      />
    )
  },
  {
    key: 'published',
    label: 'Published',
    path: 'published',
    editable: true,
    allowedRoles: [USER_ROLES.LIBRARIAN],
    render: (curation, published) => (
      <Tag colorScheme={published ? 'green' : 'red'} fontSize="12.5px">
        {published ? 'published' : 'draft'}
      </Tag>
    ),
    renderEditor: (value, error, onChange) => (
      <FormInputField
        fieldLabel="Published"
        hasError={error}
        errorText={error}
        InputComponent={
          <Switch
            id="publish-curation"
            isChecked={value}
            onChange={() => {
              onChange(!value);
            }}
          />
        }
      />
    )
  },
  {
    key: 'created_at',
    label: 'Created',
    path: 'created_at',
    allowedRoles: [USER_ROLES.LIBRARIAN],
    render: (curation, date) =>
      new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(new Date(date))
  },
  {
    key: 'updated_at',
    label: 'Updated',
    path: 'updated_at',
    allowedRoles: [USER_ROLES.LIBRARIAN],
    render: (curation, date) =>
      new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(new Date(date))
  },
  {
    key: 'action',
    label: 'action',
    path: null,
    allowedRoles: [USER_ROLES.LIBRARIAN],
    render: (curation, onClickHandler, isDisabled) => (
      <IconButton
        variant="primary_action"
        icon={<FaEdit />}
        onClick={() => onClickHandler()}
        isDisabled={isDisabled}
      />
    )
  }
];

export default curationTableAndEditorLayout;

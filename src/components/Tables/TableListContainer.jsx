import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';

const TableListContainer = ({ cols, children }) => (
  <TableContainer width="100%">
    <Table variant="striped" colorScheme="gray" layout="fixed">
      <Thead>
        <Tr>
          {cols.map((col) => (
            <Th key={col.key} padding="20px 10px">
              {col.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>{children}</Tbody>
    </Table>
  </TableContainer>
);

export default TableListContainer;

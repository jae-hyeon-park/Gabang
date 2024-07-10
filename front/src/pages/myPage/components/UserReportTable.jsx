import { Text, TableContainer, Table, Thead, Tbody, Th, Tr, Td, useDisclosure } from '@chakra-ui/react';
import ReportModal from '../../reportModal/reportModal';
import { useState } from 'react';

const UserReportTable = ({ reports }) => {
  const { isOpen: isOpenReportModal, onOpen: onOpenReportModal, onClose: onCloseReportModal } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState('');

  const handleReportClick = (report) => {
    setSelectedReport(report);
    onOpenReportModal();
  };

  const renderEmptyBody = () => {
    return (
      <Tr>
        <Td colSpan={2} textAlign="center">
          검색 결과가 없습니다.
        </Td>
      </Tr>
    );
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign="center" fontSize="lg" sx={{ width: '50%' }}>
              제목
            </Th>
            <Th textAlign="center" fontSize="lg" sx={{ width: '50%' }}>
              작성일
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports.length === 0
            ? renderEmptyBody()
            : reports.map((report, index) => (
                <Tr key={index}>
                  <Td textAlign="center">
                    <Text cursor="pointer" onClick={() => handleReportClick(report)}>
                      {report.reportTitle}
                    </Text>
                  </Td>
                  <Td textAlign="center">{report.registrationDate.split('T')[0]}</Td>
                </Tr>
              ))}
        </Tbody>
      </Table>
      <ReportModal
        isOpenReportModal={isOpenReportModal}
        onCloseReportModal={onCloseReportModal}
        selectedReport={selectedReport}
      />
    </TableContainer>
  );
};

export default UserReportTable;

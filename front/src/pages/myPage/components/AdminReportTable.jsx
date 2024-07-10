import {TableContainer, Table, Thead, Tbody, Th, Tr, Td, useDisclosure} from '@chakra-ui/react';
import ReportModal from '../../reportModal/reportModal';
import { useState } from 'react';

const AdminReportTable = ({ reports }) => {
  const { isOpen: isOpenReportModal, onOpen: onOpenReportModal, onClose: onCloseReportModal } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState("");

  const handleReportClick = (report) => {
    setSelectedReport(report);
    onOpenReportModal();
  };

  const renderEmptyBody = () => {
    return (
      <Tr>
        <Td colSpan={4} textAlign="center">검색 결과가 없습니다.</Td>
      </Tr>
    );
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign='center'>번호</Th>
            <Th textAlign='center'>제목</Th>
            <Th textAlign='center'>작성자</Th>
            <Th textAlign='center'>작성일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports.length === 0 ? renderEmptyBody() : reports.map((report, index) => (
            <Tr key={index}>
              <Td textAlign='center'>{report.reportId}</Td>
              <Td textAlign='center' cursor="pointer" onClick={() => handleReportClick(report)}>{report.reportTitle}</Td>
              <Td textAlign='center'>{report.userId}</Td>
              <Td textAlign='center'>{report.registrationDate.split('T')[0]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ReportModal isOpenReportModal={isOpenReportModal} onCloseReportModal={onCloseReportModal} selectedReport={selectedReport} />
    </TableContainer>
  );
};

export default AdminReportTable;
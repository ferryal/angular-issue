import { useSelector } from '@xstate/react';
import { Badge, Form } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useHistory } from 'react-router-dom';
import repoService from '../../machines/repo';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Pagination } from '../../components/pagination/Pagination';
import { useState } from 'react';

const RepoDetails = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');

  const repo = useSelector(repoService, (state) => state.context.data);
  const issues = useSelector(repoService, (state) => state.context.data.issues);
  const FETCHING_ISSUES = useSelector(repoService, (state) => state.matches('FETCHING_ISSUES'));

  const handleSubmit = (e) => {
    e.preventDefault();
    repoService.send({type: 'fetchIssues', query})
  }

  const handleTableChange = (prev) => (type, { page, sizePerPage }) => {
    switch (type) {
      case 'pagination':
        if (prev.issues_page !== page) {
          repoService.send({type: 'fetchIssues', pagination: {page: page || prev.page, sizePerPage}, query: prev.issues_query})
        }
        break;
      default:
    }
  }

  const columns = [
    {
      dataField: 'title',
      text: 'Title'
    }
  ]

  const rowEvents = {
    onClick: (_, row,) => {
      history.push(`/issue/${row.number}`);
    }
  };

  const paginationOption = {
    custom: true,
    totalSize: repo?.issues_total_count || 0,
    sizePerPageList: [
      { text: "3", value: 3 },
      { text: "5", value: 5 },
      { text: "10", value: 10 }
    ],
    sizePerPage: repo.issues_per_page,
    page: repo.issues_page,
  };

  return (
    <div>
      <h1>{repo?.full_name}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Control type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </Form.Group>
      </Form>

      <div className="issues-list">
        <Badge variant="success">{repo.open_issues} Open</Badge>
        {issues && (
          <PaginationProvider
            pagination={ paginationFactory(paginationOption) }
          >
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <Pagination
                  isLoading={FETCHING_ISSUES}
                  paginationProps={paginationProps}
                >
                  <BootstrapTable
                    bootstrap4
                    keyField='id'
                    data={repo.issues}
                    remote
                    columns={columns}
                    rowEvents={rowEvents}
                    onTableChange={handleTableChange(
                      repo
                    )}
                    { ...paginationTableProps }
                  />
                </Pagination>
              )
            }
          </PaginationProvider>
        )}
      </div>
    </div>
  )
}

export default RepoDetails;

import { useParams } from 'react-router-dom';
import { useSelector } from '@xstate/react';
import ReactMarkdown from 'react-markdown';
import { Badge } from 'react-bootstrap';
import { useEffect } from 'react';
import issueService from '../../machines/issue';
import repoService from '../../machines/repo';


const issueStateClass = {
  open: 'success',
  closed: 'danger',
}

const IssueDetails = () => {
  const { number } = useParams();

  const repo = useSelector(repoService, (state) => state.context.data);
  const issue = useSelector(issueService, (state) => state.context.data);
  const SUCCESS = useSelector(issueService, (state) => state.matches('SUCCESS'));

  useEffect(() => {
    if (number) {
      issueService.send({type: 'fetchIssue', data: {number}})
    }
  }, [number])

  return (
    <div>
      <h1>{repo?.full_name}</h1>
      {SUCCESS && (
        <>
          <h2>{issue.title} #{issue.number}</h2>
          <div className="issue-status">
            <Badge variant={issueStateClass[issue.state]}>{issue.state}</Badge>
          </div>
          <ReactMarkdown>{issue.body}</ReactMarkdown>
        </>
      )}
    </div>
  )
}

export default IssueDetails;

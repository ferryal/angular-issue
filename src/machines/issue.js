import { interpret, Machine, assign } from 'xstate';
import { getIssueDetails } from '../utils';;

const issueMachine = Machine({
  id: 'issueMachine',
  context: {
    data: null,
  },
  initial: 'IDLE',
  states: {
    IDLE: {},
    FETCHING_ISSUE: {
      invoke: {
        src: (_, e) => getIssueDetails(e.data),
        onDone: {
          actions: [
            assign({
              data: (_, e) => e.data,
            })
          ],
          target: 'SUCCESS',
        },
        onError: 'FAILURE',
      },
    },
    SUCCESS: {},
    FAILURE: {},
  },
  on: {
    fetchIssue: 'FETCHING_ISSUE',
  }
});

const issueService = interpret(issueMachine).start();

export default issueService;

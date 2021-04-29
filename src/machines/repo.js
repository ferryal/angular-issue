import { assign, interpret, Machine } from 'xstate';
import { getRepoDetails, getRepoIssues } from '../utils';

const repoMachine = Machine({
  id: 'repoMachine',
  context: {
    data: {
      issues: [],
      issues_total_count: 0,
      issues_per_page: 5,
      issues_page: 1,
      issues_query: '',
    },
    details: null,
  },
  initial: 'FETCHING_REPO',
  states: {
    FETCHING_REPO: {
      invoke: {
        src: (_, e) => getRepoDetails,
        onDone: {
          actions: [
            assign({
              data: (ctx, e) => ({...ctx.data, ...e.data}),
            }),
          ],
          target: 'FETCHING_ISSUES',
        },
        onError: 'FAILURE',
      },
    },
    FETCHING_ISSUES: {
      invoke: {
        src: (ctx, e) => getRepoIssues(
          e?.pagination || { sizePerPage: ctx.data.issues_per_page, page: ctx.data.issues_page },
          e.query || ctx.issues_query,
        ),
        onDone: {
          actions: [
            assign({
              data: (ctx, e) => {
                const data = {
                  ...ctx.data,
                  issues: e.data.items,
                  issues_total_count: e.data.total_count,
                  issues_page: e.data.page,
                  issues_per_page: e.data.per_page,
                  issues_query: e.data.query,
                };
                return data
              }
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
    fetchIssues: 'FETCHING_ISSUES',
  }
});

const issuesService = interpret(repoMachine).start();

export default issuesService;

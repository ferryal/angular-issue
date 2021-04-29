const headers = {
  'Content-Type': 'application/json',
}

export const getRepoDetails = async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/angular/angular`, headers);
    if (res.status === 200) {
      return await res.json();
    }
    throw Error(res.message);
  } catch (error) {
    throw Error(error);
  }
}

export const getRepoIssues = async ({ sizePerPage, page}, query) => {
  try {
    const res = await fetch(`https://api.github.com/search/issues?q=repo:angular/angular${(query ? '/' + query : '' )}&per_page=${sizePerPage}&page=${page}`, headers);
    if (res.status === 200) {
      const data = await res.json();
      return  {...data, per_page: sizePerPage, page: page, query};
    }
    throw Error(res.message);
  } catch (error) {
    throw Error(error);
  }
}

export const getIssueDetails = async (data) => {
  try {
    const res = await fetch(`https://api.github.com/repos/angular/angular/issues/${data.number}`, headers);
    if (res.status === 200) {
      return await res.json();
    }
    throw Error(res.message);
  } catch (error) {
    throw Error(error);
  }
}

export default async function github_api(token, username) {
  try {
    const headers = {
      Authorization: `bearer ${token}`,
    };
    const body = {
      query: `query {
             user(login: "${username}") {
                name
                bio
                followers { totalCount }
                following { totalCount }
                contributionsCollection {
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
    }
 
 
                 repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
                  totalCount
                  nodes {
                    name
                    description
                    stargazerCount
                    forkCount
                    languages(first: 3) { nodes { name } }
                    updatedAt
                    createdAt
                    diskUsage
                    issues(states: OPEN) { totalCount }
   }
 }
 
 
             }
           }`,
    };
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });
    const data = await response.json();
    // console.log(data)
    // console.log("rhudehufefehuifeuhifheigf efge" , data.errors[0].message)

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    let repo_name = [];
    let languages = [];
    let some = data.data.user.repositories.nodes;
    for (let i = 0; i < some.length; i++) {
      repo_name.push(some[i].name);
      languages.push(some[i].languages.nodes);
    }

    const flat = languages.flat();

    const counts = flat.reduce((acc, item) => {
      const lang = item.name;
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const total = flat.length;

    const per = Object.fromEntries(
      Object.entries(counts).map(([lang, count]) => [
        lang,
        ((count / total) * 100).toFixed(2) + "%",
      ])
    );

    const finalData = {
      name: data.data.user.name,
      bio: data.data.user?.bio,
      followers: data.data.user?.followers?.totalCount,
      following: data.data.user?.following.totalCount,
      contributionsCollection: data.data.user.contributionsCollection,
      repo: {
        repo_name,
        total: data.data.user?.repositories.totalCount,
      },

      languages: per,
    };
    return finalData;
  } catch (error) {
    console.error("Error fetching contributions:", error);
  }
}

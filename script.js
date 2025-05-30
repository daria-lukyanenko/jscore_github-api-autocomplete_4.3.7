const searchInput = document.querySelector(".search-input");
const autocompleteList = document.querySelector(".autocomplete-list");
const repoList = document.querySelector(".added-repo");

function debounce(fn, delay) {
  let timer;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

async function fetchRepoResults(searchInput) {
  if (!searchInput.trim()) return;

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${searchInput}&per_page=5`
  );
  const data = await response.json();

  autocompleteList.innerHTML = "";

  data.items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item.full_name;

    listItem.addEventListener("click", function () {
      addRepo(item);
      searchInput.value = "";
      autocompleteList.innerHTML = "";
    });
    autocompleteList.appendChild(listItem);
  });
}

function addRepo(repo) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
      <div class="repo-item">
      <span>Name: ${repo.name}</span>
      <span>Owner: ${repo.owner.login}</span>
      <span>Stars: ${repo.stargazers_count}</span>
      </div>`;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "";

  listItem.appendChild(deleteButton);
  repoList.appendChild(listItem);
}

repoList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const listItem = event.target.closest("li");
    if (listItem) {
      listItem.remove();
    }
  }
});

searchInput.addEventListener(
  "input",
  debounce(() => fetchRepoResults(searchInput.value), 400)
);

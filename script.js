const apiUrl =
  "https://raw.githubusercontent.com/theapache64/top250/master/top250.json";
let moviesData = [];
const movieListElement = document.getElementById("movieList");
const paginationElement = document.getElementById("pagination");
const ratingChartContainer = document.getElementById("ratingChartContainer");
let currentPage = 1;
const moviesPerPage = 18;
let currentSort = "title";
let isReverse = false;

// Fetch data from API and render movies
function fetchAndRenderMovies() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      moviesData = data;
      renderMovies(moviesData);
    })
    .catch((error) => {
      console.error("Error fetching movie data:", error);
    });
}

// Create a movie card element
function createMovieCard(movieData) {
  const card = document.createElement("div");
  card.className = "col-md-4 mb-4";

  const img = createImage(movieData.image);
  const cardBody = createCardBody(movieData);

  card.appendChild(img);
  card.appendChild(cardBody);

  return card;
}

// Create an image element
function createImage(src) {
  const img = document.createElement("img");
  img.className = "card-img-top";
  img.src = src;
  img.alt = "Movie Poster";
  img.style.width = "100%";
  img.style.height = "auto";
  return img;
}

// Create the card body with movie details
function createCardBody(movieData) {
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const elements = [
    createTextElement("h5", "card-title", movieData.name),
    createTextElement(
      "p",
      "card-text",
      `<strong>Year:</strong> ${movieData.datePublished}`
    ),
    createTextElement(
      "p",
      "card-text",
      `<strong>Director:</strong> ${movieData.director[0].name}`
    ),
    createTextElement(
      "p",
      "card-text",
      `<strong>Cast:</strong> ${getFullCast(movieData.actor)}`
    ),
    createTextElement(
      "p",
      "card-text",
      `<strong>Genres:</strong> ${movieData.genre.join(", ")}`
    ),
    createTextElement(
      "p",
      "card-text",
      `<strong>Rating:</strong> ${movieData.aggregateRating.ratingValue}`
    ),
    createTextElement(
      "p",
      "card-text",
      `<strong>Plot:</strong> ${movieData.description}`
    )
  ];

  elements.forEach((element) => cardBody.appendChild(element));
  return cardBody;
}

// Create a text element
function createTextElement(tagName, className, content) {
  const element = document.createElement(tagName);
  element.className = className;
  element.innerHTML = content;
  return element;
}

// Get the full cast list as a string
function getFullCast(actorList) {
  const cast = actorList.map((actor) => actor.name).join(", ");
  return cast;
}

// Handle the search input
if (document.getElementById("searchInput")) {
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
}

// Handle search

function handleSearch() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const filteredMovies = moviesData.filter(
    (movie) =>
      movie.name.toLowerCase().includes(searchValue) ||
      movie.director.some((director) =>
        director.name.toLowerCase().includes(searchValue)
      ) ||
      movie.actor.some((actor) =>
        actor.name.toLowerCase().includes(searchValue)
      )
  );

  renderMovies(filteredMovies);
}

const sortingOptions = {
  title: "title",
  year: "year",
  rating: "rating"
};

// Add event listeners to sorting options
document
  .getElementById("sortByTitle")
  .addEventListener("click", () => sortMoviesByOption(sortingOptions.title));
document
  .getElementById("sortByYear")
  .addEventListener("click", () => sortMoviesByOption(sortingOptions.year));
document
  .getElementById("sortByRating")
  .addEventListener("click", () => sortMoviesByOption(sortingOptions.rating));

function sortMoviesByOption(sortType) {
  if (currentSort === sortType) {
    isReverse = !isReverse;
  } else {
    currentSort = sortType;
    isReverse = false;
  }

  let sortedMovies;

  if (sortType === sortingOptions.title) {
    sortedMovies = moviesData
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === sortingOptions.year) {
    sortedMovies = moviesData
      .slice()
      .sort((a, b) => a.datePublished.localeCompare(b.datePublished));
  } else if (sortType === sortingOptions.rating) {
    sortedMovies = moviesData
      .slice()
      .sort(
        (a, b) => b.aggregateRating.ratingValue - a.aggregateRating.ratingValue
      );
  }

  renderMovies(sortedMovies);
}

// Initial fetch and rendering
fetchAndRenderMovies();

// Render movies with pagination
function renderMovies(movieData) {
  movieListElement.innerHTML = ""; // Clear previous content
  const startIndex = (currentPage - 1) * moviesPerPage;
  let endIndex = startIndex + moviesPerPage;
  if (endIndex > movieData.length) {
    endIndex = movieData.length;
  }

  let sortedMovies = movieData.slice();
  if (currentSort === "title") {
    sortedMovies.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "year") {
    sortedMovies.sort((a, b) => a.datePublished.localeCompare(b.datePublished));
  } else if (currentSort === "rating") {
    sortedMovies.sort(
      (a, b) => b.aggregateRating.ratingValue - a.aggregateRating.ratingValue
    );
  }

  if (isReverse) {
    sortedMovies.reverse();
  }

  for (let i = startIndex; i < endIndex; i++) {
    const card = createMovieCard(sortedMovies[i]);
    movieListElement.appendChild(card);
  }
}
// Pagination
function renderPagination(totalPages) {
  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === currentPage ? " active" : "");
    const link = document.createElement("a");
    link.className = "page-link";
    link.href = "#";
    link.textContent = i;
    link.addEventListener("click", () => {
      currentPage = i;
      renderMovies(moviesData);
    });

    li.appendChild(link);
    paginationElement.appendChild(li);
  }
}


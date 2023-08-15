

// Generate a random movie based on genre choice
document.getElementById("generateRandomMovie").addEventListener("click", () => {
  const selectedGenre = document.getElementById("genreSelect").value;
  const moviesByGenre = moviesData.filter((movie) =>
    movie.genre.includes(selectedGenre)
  );

  if (moviesByGenre.length > 0) {
    const randomIndex = Math.floor(Math.random() * moviesByGenre.length);
    const randomMovie = moviesByGenre[randomIndex];
    renderRandomMovie(randomMovie);
  } else {
    alert(`No movies found for the selected genre: ${selectedGenre}`);
  }
});

// Render a random movie
function renderRandomMovie(movieData) {
  const randomMovieElement = document.createElement("div");
  randomMovieElement.className = "col-md-12 mb-4";

  const img = createImage(movieData.image);
  const cardBody = createCardBody(movieData);

  randomMovieElement.appendChild(img);
  randomMovieElement.appendChild(cardBody);

  const movieListElement = document.getElementById("movieList");
  movieListElement.innerHTML = "";
  movieListElement.appendChild(randomMovieElement);
}

// Initial fetch and rendering
fetchAndRenderMovies();

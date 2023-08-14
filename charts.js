const apiUrl =
  "https://raw.githubusercontent.com/theapache64/top250/master/top250.json";
let moviesData = [];

function fetchMoviesData() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      moviesData = data;
      generateReleaseYearDistributionChart();
      generateGenreDistributionChart();
      generateTopDirectorsChart();
      generateTopActorsChart();
      generateRatingOverYearsChart();
    })
    .catch((error) => {
      console.error("Error fetching movie data:", error);
    });
}

//Release Year Chart

function generateReleaseYearDistributionChart() {
  const chartContainer = document.getElementById(
    "releaseYearDistributionChartContainer"
  );
  const chart = echarts.init(chartContainer);

  const releaseYears = {};

  moviesData.forEach((movie) => {
    const releaseYear = parseInt(movie.datePublished.substring(0, 4));
    if (!isNaN(releaseYear)) {
      if (!releaseYears[releaseYear]) {
        releaseYears[releaseYear] = 0;
      }
      releaseYears[releaseYear]++;
    }
  });

  const years = Object.keys(releaseYears);
  const movieCounts = Object.values(releaseYears);

  const option = {
    title: {
      text: "Movies by Release Year"
    },
    xAxis: {
      type: "category",
      data: years
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: movieCounts,
        type: "bar"
      }
    ]
  };

  chart.setOption(option);
}

//Genre Chart

function generateGenreDistributionChart() {
  const chartContainer = document.getElementById(
    "genreDistributionChartContainer"
  );
  const chart = echarts.init(chartContainer);

  const genreCounts = {};

  moviesData.forEach((movie) => {
    movie.genre.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const data = Object.keys(genreCounts).map((genre) => ({
    name: genre,
    value: genreCounts[genre]
  }));

  const chartOption = {
    title: {
      text: "Genre Distribution"
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: data
      }
    ]
  };

  chart.setOption(chartOption);
}

//Top Directors Chart

function generateTopDirectorsChart() {
  const chartContainer = document.getElementById("topDirectorsChartContainer");
  const chart = echarts.init(chartContainer);

  const directorRatings = {};

  moviesData.forEach((movie) => {
    movie.director.forEach((director) => {
      if (!directorRatings[director.name]) {
        directorRatings[director.name] = 0;
      }
      directorRatings[director.name] += movie.aggregateRating.ratingValue;
    });
  });

  const sortedDirectors = Object.keys(directorRatings).sort(
    (a, b) => directorRatings[b] - directorRatings[a]
  );

  const topDirectors = sortedDirectors.slice(0, 15);

  const data = topDirectors.map((director) => ({
    name: director,
    rating: directorRatings[director]
  }));

  const chartOption = {
    color: ["#FFD700"],
    title: {
      text: "Top Directors by Rating"
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.name),
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "bar",
        data: data.map((d) => d.rating)
      }
    ]
  };

  chart.setOption(chartOption);
}

// Top Actors Chart

function generateTopActorsChart() {
  const chartContainer = document.getElementById("topActorsChartContainer");
  const chart = echarts.init(chartContainer);

  const actorRatings = {};

  moviesData.forEach((movie) => {
    movie.actor.forEach((actor) => {
      if (!actorRatings[actor.name]) {
        actorRatings[actor.name] = 0;
      }
      actorRatings[actor.name] += movie.aggregateRating.ratingValue;
    });
  });

  const sortedActors = Object.keys(actorRatings).sort(
    (a, b) => actorRatings[b] - actorRatings[a]
  );

  const topActors = sortedActors.slice(0, 15);

  const data = topActors.map((actor) => ({
    name: actor,
    rating: actorRatings[actor]
  }));

  const chartOption = {
    title: {
      text: "Top Actors by Rating"
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.name),
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "bar",
        data: data.map((d) => d.rating)
      }
    ]
  };

  chart.setOption(chartOption);
}

// Movie Ratings Over The Years

function generateRatingOverYearsChart() {
  const chartContainer = document.getElementById(
    "ratingOverYearsChartContainer"
  );
  const chart = echarts.init(chartContainer);

  const ratingOverYears = {};

  moviesData.forEach((movie) => {
    const releaseYear = parseInt(movie.datePublished.substring(0, 4));
    const rating = parseFloat(movie.aggregateRating.ratingValue);
    if (!isNaN(releaseYear) && !isNaN(rating)) {
      if (!ratingOverYears[releaseYear]) {
        ratingOverYears[releaseYear] = [];
      }
      ratingOverYears[releaseYear].push(rating);
    }
  });

  const years = Object.keys(ratingOverYears);
  const avgRatings = years.map((year) => {
    const ratings = ratingOverYears[year];
    const avgRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return avgRating.toFixed(2);
  });

  const chartOption = {
    color: ["#FFD700"],
    title: {
      text: "Average Movie Ratings Over the Years"
    },
    xAxis: {
      type: "category",
      data: years
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}"
      },
      min: 7,
      max: 10
    },

    series: [
      {
        data: avgRatings,
        type: "line"
      }
    ]
  };

  chart.setOption(chartOption);
}

document.addEventListener("DOMContentLoaded", function () {
  fetchMoviesData();
});

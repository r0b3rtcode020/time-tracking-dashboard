// DOM elements
const navItems = document.querySelectorAll("#dashboard .dashboard__item");
const stats = document.querySelectorAll("#dashboard .dashboard__data");

// Global state
let dashboardData = [];
let activeFilter = "daily";

// Adjusts the hour label (1hr or 2hrs)
const getHourText = hours => (hours === 1 ? "hr" : "hrs");

// Returns the label for the previous period
const getPreviousLabel = period => {
  const labels = {
    daily: "Yesterday",
    weekly: "Last week",
    monthly: "Last month",
  };
  return labels[period] || "Previous";
};

// Loads the data from the JSON file
const loadData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return [];
  }
};

// Updates the active navigation item
const updateActiveNavItem = period => {
  navItems.forEach(item => {
    item.classList.toggle("is-active", item.dataset.period === period);
  });
};

// Updates the stats card with the period data
const updateStatCard = (statCard, activityData, period) => {
  const currentTime = statCard.querySelector(".data__time");
  const previousTime = statCard.querySelector(".data__previous");
  const timeframes = activityData?.timeframes?.[period];

  if (!timeframes) return;

  const { current, previous } = timeframes;
  currentTime.textContent = `${current}${getHourText(current)}`;
  previousTime.textContent = `${getPreviousLabel(period)} - ${previous}${getHourText(previous)}`;
};

// Updates the dashboard with the selected period data
const updateDashboard = period => {
  if (!dashboardData.length) {
    console.error("No hay datos cargados");
    return;
  }

  activeFilter = period;
  updateActiveNavItem(period);

  stats.forEach((statCard, i) => {
    updateStatCard(statCard, dashboardData[i], period);
  });
};

// Sets up the click event for navigation
const navigationListener = () => {
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const period = item.dataset.period;
      period && updateDashboard(period);
    });
  });
};

// Initialization
const init = async () => {
  dashboardData = await loadData();
  navigationListener();
  updateDashboard(activeFilter);
};

// App start
init();

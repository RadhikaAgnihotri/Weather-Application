export const forecastDisplayItems = (forecast, type, unit) => {
    console.log("forecastDisplayItems input →", type, forecast);
  if (!forecast || !Array.isArray(forecast)) return [];

  const convertTemp = (tempCelsius) =>
    unit === 'F' ? Math.round((tempCelsius * 9) / 5 + 32) : Math.round(tempCelsius);

  const groupByDay = () => {
    const daysMap = new Map();
    forecast.forEach((entry) => {
      const date = new Date(entry.dt_txt);
      const key = date.toISOString().split('T')[0];
      if (!daysMap.has(key)) daysMap.set(key, []);
      daysMap.get(key).push(entry);
    });
    return Array.from(daysMap.values());
  };

  const renderItem = (item) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
    temp: convertTemp(item.main.temp),
    description: item.weather[0].description,
  });

  if (type === 'hourly') {
    return forecast.slice(0, 10).map(renderItem); // Next ~30 hours in 3-hour steps
  } else if (type === '3day' || type === '3d') {
    return groupByDay()
      .slice(0, 3)
      .map((entries) => renderItem(entries[Math.floor(entries.length / 2)]));
  } 

  return []; // fallback
};

// 시간을 시:분:초 형식으로 변환
function parseTime(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return { hours, minutes, seconds };
}

// 시간과 분을 합산하는 함수
function sumTime(timeStrings) {
  let totalSeconds = 0;
  
  timeStrings.forEach(timeString => {
    const { hours, minutes, seconds } = parseTime(timeString);
    totalSeconds += (hours * 3600) + (minutes * 60) + seconds;
  });
  
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const totalMinutes = Math.floor(remainingSeconds / 60);
  
  return { hours: totalHours, minutes: totalMinutes };
}

// 웹 페이지에서 JSON 데이터를 추출하고 처리하는 함수
async function processData(data) {
  try {
    const startDate = new Date('2024-06-27');
	const endDate = new Date('2024-07-22');

	data = JSON.parse(data);
    // 날짜 범위 내의 데이터 필터링
    const filteredTimes = Object.entries(data)
      .filter(([date]) => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
      })
      .map(([_, time]) => time);

    // 시간과 분 합산
    const totalTime = sumTime(filteredTimes);

    console.log(`Total time from 2024-06-27 to 2024-07-22 is ${totalTime.hours} hours and ${totalTime.minutes} minutes.`);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

module.exports = {
	processData
};

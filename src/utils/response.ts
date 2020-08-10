export const convertToBarChart = (response: any) => {
  const jsonResponse = JSON.parse(response);
  if (jsonResponse.default && jsonResponse.default.timelineData) {
    return jsonResponse.default.timelineData.reduce((acc: any, cur: any) => {
      acc.push([cur.formattedTime, cur.value[0]]);
      return acc;
    }, []);
  }
  return [];
};

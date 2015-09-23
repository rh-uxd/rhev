angular.module('rhev.appModule').factory('ChartsDataMixin', ['$timeout', '$q', function chartDataMixinFactory ($timeout, $q) {

  var getSparklineData = function (data, dataName, isMinutes) {
    var sparklineData = [dataName || 'data'];
    var dates = ['dates'];

    if (data) {
      // Add the data to the sparkline data
      sparklineData = sparklineData.concat(data.data);

      // Add the x axis data to the sparkline data
      if (data.dates && data.dates.length > 0) {
        for (var i = 0; i < data.dates.length; i++) {
          dates.push(new Date(data.dates[i]));
        }
      }
      else {
        // Use fake dates
        var today = new Date();
        for (var d = data.data.length - 1; d >= 0; d--) {
          if (isMinutes === true) {
            dates.push(new Date(today.getTime() - (d * 60 * 1000)));
          }
          else {
            dates.push(new Date(today.getTime() - (d * 24 * 60 * 60 * 1000)));
          }
        }
      }
    }
    return {
      xDataName: 'dates',
      xData:     dates,
      yData:      sparklineData
    };
  };

  var getCpuUsageDataFromData = function(data, usageDataName) {

    var cpuUsageData = data.cpuUsageData;
    var sparklineData = getSparklineData(data.cpuUsageData, usageDataName);
    cpuUsageData.xDataName = sparklineData.xDataName;
    cpuUsageData.xData = sparklineData.xData;
    cpuUsageData.yData = sparklineData.yData;

    return cpuUsageData;
  };

  var getCpuUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;
    return getCpuUsageDataFromData(data, usageDataName);
  };

  var getMemoryUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;

    var memoryUsageData = data.memoryUsageData;
    var sparklineData = getSparklineData(data.memoryUsageData, usageDataName);
    memoryUsageData.xDataName = sparklineData.xDataName;
    memoryUsageData.xData = sparklineData.xData;
    memoryUsageData.yData = sparklineData.yData;

    return memoryUsageData;
  };

  var getNetworkUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;

    var networkUsageData = data.networkUsageData;
    var sparklineData = getSparklineData(data.networkUsageData, usageDataName);
    networkUsageData.xDataName = sparklineData.xDataName;
    networkUsageData.xData = sparklineData.xData;
    networkUsageData.yData = sparklineData.yData;

    return networkUsageData;
  };

  var getStorageUsageDataFromResponse = function(response, usageDataName) {
    var data = response.data;

    var storageUsageData = data.storageUsageData;
    var sparklineData = getSparklineData(data.storageUsageData, usageDataName);
    storageUsageData.xDataName = sparklineData.xDataName;
    storageUsageData.xData = sparklineData.xData;
    storageUsageData.yData = sparklineData.yData;

    return storageUsageData;
  };

  return {
    getSparklineData:               getSparklineData,
    getCpuUsageDataFromData:        getCpuUsageDataFromData,
    getCpuUsageDataFromResponse:    getCpuUsageDataFromResponse,
    getMemoryUsageDataFromResponse: getMemoryUsageDataFromResponse,
    getNetworkUsageDataFromResponse: getNetworkUsageDataFromResponse,
    getStorageUsageDataFromResponse: getStorageUsageDataFromResponse,
    dashboardSparklineChartHeight:  56,
    dashboardHeatmapChartHeight:    "150px",
    nodeHeatMapUsageLegendLabels:   ['< 70%', '70-80%' ,'80-90%', '> 90%']
  };
}]);

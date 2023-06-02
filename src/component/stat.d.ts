export interface CongestionDataType {
  status: {
    code: string;
    message: string;
    totalCount: number;
  };
  contents: {
    subwayLine: `${number}호선`;
    stationName: string;
    stationCode: `${number}`;
    stat: {
      startStationCode: string;
      startStationName: string;
      endStationCode: string;
      endStationName: string;
      prevStationCode: string;
      prevStationName: string;
      updnLine: number;
      directAt: number;
      data: {
        dow: string;
        hh: string;
        mm: string;
        congestionTrain: number;
      }[];
    }[];
    statStartDate: string;
    statEndDate: string;
  };
}

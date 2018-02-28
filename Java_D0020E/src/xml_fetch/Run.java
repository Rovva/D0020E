package xml_fetch;

public class Run {

	static FetchFiles fetch = new FetchFiles();
	static ConvertStationXML stations = new ConvertStationXML();
	static ConvertWeatherXML weather = new ConvertWeatherXML();
	
	public static void main(String[] args) {
		//fetch.fetchStations();
		//stations.ConvertStation();
		//stations.saveData();
		//stations.printData();
		weather.ConvertStation();
		weather.saveData();
		//weather.printData();
	}

}

package xml_fetch;

import java.util.concurrent.TimeUnit;

public class Run {

	static FetchFiles fetch = new FetchFiles();
	static ConvertStationXML stations = new ConvertStationXML();
	static ConvertWeatherXML weather = new ConvertWeatherXML();
	static FormatFiles format = new FormatFiles();
	static SendToMysql mysql = new SendToMysql();
	
	public static void main(String[] args) {
		
		fetch.fetchStations();
		fetch.fetchWeather();
		stations.ConvertStation();
		stations.saveData();
		//stations.printData();
		weather.ConvertStation();
		weather.saveData();
		//weather.printData();
		format.loadStations();
		//format.printStations();
		format.loadWeather();
		//format.printWeather();
		format.combineData();
		mysql.readData();
		mysql.insertToMysql();
		
	}

}

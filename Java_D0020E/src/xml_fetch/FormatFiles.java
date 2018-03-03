package xml_fetch;

import java.util.ArrayList;
import java.io.*;

public class FormatFiles {
	String tempStations = "temp_stations.txt";
	String tempWeather = "temp_weather.txt";
	
	ArrayList<String> station_place = new ArrayList<String>();
	ArrayList<Float> station_latitude = new ArrayList<Float>();
	ArrayList<Float> station_longitude = new ArrayList<Float>();
	
	ArrayList<String> station_weather = new ArrayList<String>();
	ArrayList<String> station_date = new ArrayList<String>();
	ArrayList<Float> station_air = new ArrayList<Float>();
	ArrayList<Float> station_road = new ArrayList<Float>();
	ArrayList<Float> station_humid = new ArrayList<Float>();
	
	public FormatFiles() {
		
	}
	
	public void loadStations() {
		try (BufferedReader br = new BufferedReader(new FileReader(tempStations))) {
		    String line;
		    while ((line = br.readLine()) != null) {
		       String[] array = line.split(" ");
		       station_place.add(array[0]);
		       station_latitude.add(Float.parseFloat(array[1]));
		       station_longitude.add(Float.parseFloat(array[2]));
		    }
		} catch(Exception e) {
			System.out.println("Something went wrong...");
		}
	}
	
	public void printStations() {
		for(int i = 0; i < station_place.size(); i++) {
			System.out.println("Station: " + station_place.get(i) + 
					" Latitude: " + station_latitude.get(i) + " Longitude: " + station_longitude.get(i));
		}
	}
	
	public void loadWeather() {
		try (BufferedReader br = new BufferedReader(new FileReader(tempWeather))) {
		    String line;
		    while ((line = br.readLine()) != null) {
		       String[] array = line.split(" ");
		       station_weather.add(array[0]);
		       station_date.add(array[1]);
		       station_air.add(Float.parseFloat(array[2]));
		       station_road.add(Float.parseFloat(array[3]));
		       station_humid.add(Float.parseFloat(array[4]));
		    }
		} catch(Exception e) {
			System.out.println("Something went wrong...");
		}
	}
	
	public void printWeather() {
		for(int i = 0; i < station_weather.size(); i++) {
			System.out.println("Station: " + station_weather.get(i) + " Date: " + station_date.get(i) + " Air: " +
					station_air.get(i) + " Road: " + station_road.get(i) + " Humidity: " + station_humid.get(i));
		}
	}
	
	public void combineData() {
		String line = "";
		int coordinate_place;
		try (PrintWriter out = new PrintWriter("combined_data.txt")) {
			for(int i = 0; i < station_weather.size(); i++) {
				coordinate_place = station_place.indexOf(station_weather.get(i));
				line = station_weather.get(i) + " " + station_date.get(i) + " " + station_latitude.get(coordinate_place) + " " + 
						station_longitude.get(coordinate_place) + " " + station_air.get(i) + " " + station_road.get(i)
						 + " " + station_humid.get(i);
				//System.out.println(line);
				out.println(line);
			}
			out.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

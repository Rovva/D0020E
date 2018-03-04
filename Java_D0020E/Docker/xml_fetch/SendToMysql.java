package xml_fetch;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.*;
import java.util.ArrayList;

public class SendToMysql {
	
	Connection myConnection = null;
	String data = "combined_data.txt";
	
	ArrayList<String> station_weather = new ArrayList<String>();
	ArrayList<String> station_date = new ArrayList<String>();
	ArrayList<Float> station_latitude = new ArrayList<Float>();
	ArrayList<Float> station_longitude = new ArrayList<Float>();
	ArrayList<Float> station_air = new ArrayList<Float>();
	ArrayList<Float> station_road = new ArrayList<Float>();
	ArrayList<Float> station_humid = new ArrayList<Float>();

    public SendToMysql() {
    	
    }
    
    public void readData() {
    	try (BufferedReader br = new BufferedReader(new FileReader(data))) {
		    String line;
		    while ((line = br.readLine()) != null) {
		       String[] array = line.split(" ");
		       station_weather.add(array[0]);
		       station_date.add(array[1]);
		       station_latitude.add(Float.parseFloat(array[2]));
		       station_longitude.add(Float.parseFloat(array[3]));
		       station_air.add(Float.parseFloat(array[4]));
		       station_road.add(Float.parseFloat(array[5]));
		       station_humid.add(Float.parseFloat(array[6]));
		    }
		    formatDate();
		} catch(Exception e) {
			System.out.println("Something went wrong...");
		}
    }
    
    public void formatDate() {
    	ArrayList<String> temp_station_date = new ArrayList<String>();
    	String temp = "";
    	for(int i = 0; i < station_date.size(); i++) {
    		temp = station_date.get(i).substring(0, 10) + " " + station_date.get(i).substring(11, 17) + "00";
    		temp_station_date.add(temp);
    	}
    	station_date = temp_station_date;
    }
    
    public void insertToMysql() {
    	try {
        	String dbUrl = "jdbc:mysql://rcm-mysql:3306/db";
        	String username = "user";
        	String password = "pass";
        	Connection myConnection = DriverManager.getConnection(dbUrl, username, password);
        	Statement myStatement = myConnection.createStatement();
        	ResultSet myResultSet;
        	for(int i = 0; i < station_weather.size(); i++) {
        		myResultSet = myStatement.executeQuery("INSERT INTO datareceiver_roadeyedata (timestamp, "
        				+ "latitude, longitude, road_temperature, air_temperature, air_humidity) "
        				+ "VALUES ('" + station_date.get(i) + "', '" + station_latitude.get(i) + "', '" +
        				station_longitude.get(i) + "', '" + station_road.get(i) + "', '" + station_air.get(i) + "', '"
        				+ station_humid.get(i) + "')");
        	}
        	//ResultSet myResultSet = myStatement.executeQuery("INSERT INTO datareceiver_roadeyedata");
        	
    	} catch(Exception e) {
    		System.out.println(e.getMessage());
    	}
    }
    
    public void testMysql() {
    	
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
    	
    	try {
        	String dbUrl = "jdbc:mysql://rcm-mysql:3306/db";
        	String username = "user";
        	String password = "pass";
        	Connection myConnection = DriverManager.getConnection(dbUrl, username, password);
        	Statement myStatement = myConnection.createStatement();
        	ResultSet myResultSet = myStatement.executeQuery("select * from datareceiver_roadeyedata");
        	while(myResultSet.next()) {
        		System.out.println("id: " + myResultSet.getString("id"));
        	}
        	
    	} catch(Exception e) {
    		System.out.println(e.getMessage());
    	}
    }
    
}

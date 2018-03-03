package xml_fetch;

import java.util.ArrayList;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.*;
import java.io.*;


public class ConvertWeatherXML {

	String weatherXML = "weather_cache.xml";
	
	// All of the ArrayLists needed
	ArrayList<String> stations = new ArrayList<String>();
	ArrayList<String> dates = new ArrayList<String>();
	ArrayList<Float> airTemperature = new ArrayList<Float>();
	ArrayList<Float> roadTemperature = new ArrayList<Float>();
	ArrayList<Float> humidities = new ArrayList<Float>();
	
	public ConvertWeatherXML() {
		
	}
	
	public void ConvertStation() {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		
		try {
			//Used to store XML instances
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(weatherXML);
			
			// Start parsing from the most convenient place in the XML-document
			NodeList weatherList = doc.getElementsByTagName("siteMeasurements");
			
			// Temporary storage variables
			String id = "";
			String date = "";
			float airtemp = 0;
			float roadtemp = 0;
			float humid = 0;
			
			// The control variables to check if a station should be skipped
			boolean for_id = true;
			boolean for_date = true;
			boolean for_airtemp = true;
			boolean for_roadtemp = true;
			boolean for_hum = true;
			for(int i = 0; i < weatherList.getLength(); i++) {
				
				Node list = weatherList.item(i);
				
				if (list.getNodeType()==Node.ELEMENT_NODE) {
					
					// I seriously hate XML, if someone can figure out a better way, please improve!
					// Try to get station id
					try {
						id = list.getChildNodes().item(0).getAttributes().getNamedItem("id").getTextContent();
						for_id = true;
					} catch(Exception e) {
						// If not able to, set for_id to false
						for_id = false;
					}
					// Try to get date
					try {
						date = list.getChildNodes().item(1).getTextContent();
						for_date = true;
					} catch(Exception e) {
						for_date = false;
					}
					// Try to get air temperature
					try {
						airtemp = Float.parseFloat(list.getChildNodes().item(4).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								    .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_airtemp = true;
					} catch(Exception e) {
						for_airtemp = false;
					}
					// Try to get road temperature
					try {
						roadtemp = Float.parseFloat(list.getChildNodes().item(5).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								     .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_roadtemp = true;
					} catch(Exception e) {
						for_roadtemp = false;
					}
					// Try to get humidity
					try {
						humid = Float.parseFloat(list.getChildNodes().item(9).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								    .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_hum = true;
					} catch(Exception e) {
						for_hum = false;
					}
					// Only add stations that have true on all of the control-variables
					if(for_id && for_date && for_airtemp && for_roadtemp && for_hum) {
						stations.add(id);
						dates.add(date);
						airTemperature.add(airtemp);
						roadTemperature.add(roadtemp);
						humidities.add(humid);
					}
				}
			}		
			
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}
	
	public void printData() {
		// Simple loop to output data to console
		for(int i = 0; i < stations.size(); i++) {
			System.out.println("StationID: " + stations.get(i) + " Date: " + dates.get(i) + " Air: " + airTemperature.get(i)
			  + " Road: " + roadTemperature.get(i) + " Humidity: " + humidities.get(i));
		}
	}

	public void saveData() {
		// A simple try/catch method of writing to a file
		try (PrintWriter out = new PrintWriter("temp_weather.txt")) {
			for(int i = 0; i < stations.size(); i++) {
				    out.println(stations.get(i) + " " + dates.get(i) + " " + airTemperature.get(i) + " " + roadTemperature.get(i) + " " + humidities.get(i));
			}
			out.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}

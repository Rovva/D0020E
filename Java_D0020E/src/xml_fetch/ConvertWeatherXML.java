package xml_fetch;

import java.util.ArrayList;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.*;
import java.io.*;


public class ConvertWeatherXML {

	String weatherXML = "weather_cache.xml";
	
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
			
			NodeList weatherList = doc.getElementsByTagName("siteMeasurements");
			
			String id = "";
			String date = "";
			float airtemp = 0;
			float roadtemp = 0;
			float humid = 0;
			
			boolean for_id = true;
			boolean for_date = true;
			boolean for_airtemp = true;
			boolean for_roadtemp = true;
			boolean for_hum = true;
			for(int i = 0; i < weatherList.getLength(); i++) {
				
				Node list = weatherList.item(i);
				
				if (list.getNodeType()==Node.ELEMENT_NODE) {
					
					// I seriously hate XML, if someone can figure out a better way, please improve!
					try {
						id = list.getChildNodes().item(0).getAttributes().getNamedItem("id").getTextContent();
						for_id = true;
					} catch(Exception e) {
						for_id = false;
					}

					try {
						date = list.getChildNodes().item(1).getTextContent();
						for_date = true;
					} catch(Exception e) {
						for_date = false;
					}

					try {
						airtemp = Float.parseFloat(list.getChildNodes().item(4).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								    .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_airtemp = true;
					} catch(Exception e) {
						for_airtemp = false;
					}

					try {
						roadtemp = Float.parseFloat(list.getChildNodes().item(5).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								     .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_roadtemp = true;
					} catch(Exception e) {
						for_roadtemp = false;
					}
					
					try {
						humid = Float.parseFloat(list.getChildNodes().item(9).getChildNodes().item(0).getChildNodes().item(0).getChildNodes()
								    .item(0).getChildNodes().item(0).getChildNodes().item(0).getTextContent());
						for_hum = true;
					} catch(Exception e) {
						for_hum = false;
					}
					if(for_id && for_date && for_airtemp && for_roadtemp && for_hum) {
						stations.add(id);
						dates.add(date);
						airTemperature.add(airtemp);
						roadTemperature.add(roadtemp);
						humidities.add(humid);
					}
					
					/*
					try {
						System.out.println(Float.parseFloat(list.getChildNodes().item(19).getChildNodes().item(1).getChildNodes().item(1).getChildNodes().item(1).getTextContent()));
					} catch(Exception e) {
						for_hum = true;
					}
					*/
					//String id = list.getChildNodes().item(1).getAttributes().getNamedItem("id").getTextContent();
					//String date = list.getChildNodes().item(3).getTextContent();
					
					/*
					float airTemp = Float.parseFloat(list.getChildNodes().item(9).getChildNodes().item(1).getChildNodes().item(1).getChildNodes().item(1).getTextContent());
					float roadTemp = Float.parseFloat(list.getChildNodes().item(11).getChildNodes().item(1).getChildNodes().item(1).getChildNodes().item(1).getTextContent());
					float humidity = Float.parseFloat(list.getChildNodes().item(19).getChildNodes().item(1).getChildNodes().item(1).getChildNodes().item(1).getTextContent());
					*/
					
					/* Some debugging prints
					System.out.println(id);
					System.out.println(date);
					
					System.out.println(airTemp);
					System.out.println(roadTemp);
					System.out.println(humidity);
					*/

					// This is to fetch station id:
					// list.getChildNodes().item(1).getAttributes().getNamedItem("id").getTextContent()
					
					// This is to fetch date:
					// list.getChildNodes().item(3).getTextContent()
					
					// This is the code for all the measuredValue indexes.
					//System.out.println(list.getChildNodes().item(5).getNodeName()); // index 1
					//System.out.println(list.getChildNodes().item(7).getNodeName()); // index 2
					//System.out.println(list.getChildNodes().item(9).getNodeName()); // index 3
					//System.out.println(list.getChildNodes().item(11).getNodeName()); // index 4
					//System.out.println(list.getChildNodes().item(11).getNodeName()); // index 5
					//System.out.println(list.getChildNodes().item(13).getNodeName()); // index 6
					//System.out.println(list.getChildNodes().item(15).getNodeName()); // index 7
					//System.out.println(list.getChildNodes().item(17).getNodeName()); // index 8
					
					
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
		for(int i = 0; i < stations.size(); i++) {
			System.out.println("StationID: " + stations.get(i) + " Date: " + dates.get(i) + " Air: " + airTemperature.get(i)
			  + " Road: " + roadTemperature.get(i) + " Humidity: " + humidities.get(i));
		}
	}

	public void saveData() {
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

package xml_fetch;

import java.util.ArrayList;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.*;
import java.io.*;


public class ConvertWeatherXML {

	String weatherXML = "test_weather_cache.xml";
	
	ArrayList<String> stations = new ArrayList<String>();
	ArrayList<Float> timestamp = new ArrayList<Float>();
	ArrayList<Float> temperatureInfo = new ArrayList<Float>();
	ArrayList<Float> roadTemperature = new ArrayList<Float>();
	ArrayList<Float> humidity = new ArrayList<Float>();
	
	public ConvertWeatherXML() {
		
	}
	
	public void ConvertStation() {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		
		try {
			//Used to store XML instances
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(weatherXML);
			
			NodeList weatherList = doc.getElementsByTagName("siteMeasurements");

			for(int i = 0; i < weatherList.getLength(); i++) {
				
				Node list = weatherList.item(i);
				
				if (list.getNodeType()==Node.ELEMENT_NODE) { 				//If the item in current index, is of type; ELEMENT_NODE...
					Element stationID = (Element) list; 
					//stations.add(stationID.getAttribute("id")); 			//Add the "id" value to "stations" Arraylist.
					
					System.out.println(list.getChildNodes().item(1).getAttributes().getNamedItem("id"));
					System.out.println(list.getChildNodes().item(3).getTextContent());
					//System.out.println(list.getChildNodes().item(5).getAttributes().getNamedItem("index"));
					System.out.println(stationID.getElementsByTagName("measuredValue").item(5).getTextContent());
					System.out.println(stationID.getElementsByTagName("measuredValue").item(6).getTextContent());
					
					//System.out.println(childs.item(1).getAttributes().getNamedItem("id").getTextContent());
					//System.out.println(childs.item(2).getNodeValue());
					
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
}

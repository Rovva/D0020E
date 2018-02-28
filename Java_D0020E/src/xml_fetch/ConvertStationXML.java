package xml_fetch;

import java.util.ArrayList;

import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.*;
import java.io.*;

public class ConvertStationXML {

	String stationXML = "test_station_cache.xml";
	
	ArrayList<String> stations = new ArrayList<String>();
	ArrayList<Float> latitude = new ArrayList<Float>();
	ArrayList<Float> longitude = new ArrayList<Float>();
	
	public ConvertStationXML() {
		
	}
	
	public void ConvertStation() {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		
		try {
			//Used to store XML instances
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(stationXML);
			
			NodeList stationList = doc.getElementsByTagName("ns0:measurementSiteRecord");
			
			for(int i = 0; i < stationList.getLength(); i++) {
				
				Node list = stationList.item(i);
				
				if (list.getNodeType()==Node.ELEMENT_NODE) { 				//If the item in current index, is of type; ELEMENT_NODE...
					Element stationID = (Element) list; 
					//stations.add(stationID.getAttribute("id")); 			//Add the "id" value to "stations" Arraylist.
					
					stations.add((String) stationID.getAttribute("id"));
					latitude.add(Float.parseFloat(stationID.getElementsByTagName("ns0:latitude").item(0).getChildNodes().item(0).getNodeValue()));
					longitude.add(Float.parseFloat(stationID.getElementsByTagName("ns0:longitude").item(0).getChildNodes().item(0).getNodeValue()));  
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
			System.out.println("Station id: " + stations.get(i) + " latitude: " + latitude.get(i) + " longitude: " + longitude.get(i));
		}
	}
	
	public void saveData() {
		try (PrintWriter out = new PrintWriter("temp_stations.txt")) {
			for(int i = 0; i < stations.size(); i++) {
				    out.println(stations.get(i) + " " + latitude.get(i) + " " + longitude.get(i));
			}
			out.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
package xml_fetch;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import java.util.Base64;

public class FetchFiles {

	String stationURL = "https://datex.trafikverket.se/D2ClientPull/MetaDataBA/2_3/WeatherMetaData";
	String weatherURL = "https://datex.trafikverket.se/D2ClientPull/WeatherPullServerBA/2_3/Weather";
	DocumentBuilderFactory factory;
	Document doc;
	
	public FetchFiles() {
		
	}
	
	void fetchWeather() {
		try {
			URL url = new URL(weatherURL);
			String encoding = Base64.getEncoder().encodeToString(("LTU:DatexLTU2018#").getBytes( "UTF-8" ));
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoOutput(true);
            connection.setRequestProperty  ("Authorization", "Basic " + encoding);

            File file = new File("weather_cache.xml");
            InputStream in = (InputStream) connection.getInputStream();
            OutputStream out = new BufferedOutputStream(new FileOutputStream(file));
            for (int b; (b = in.read()) != -1;) {
                out.write(b);
            }
            out.close();
            in.close();
            System.out.println("Weather xmlfile saved.");
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Something went wrong...");
		}
	}
	
	void fetchStations() {
		try {
			URL url = new URL(stationURL);
			String encoding = Base64.getEncoder().encodeToString(("LTU:DatexLTU2018#").getBytes( "UTF-8" ));
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoOutput(true);
            connection.setRequestProperty  ("Authorization", "Basic " + encoding);

            File file = new File("station_cache.xml");
            InputStream in = (InputStream) connection.getInputStream();
            OutputStream out = new BufferedOutputStream(new FileOutputStream(file));
            for (int b; (b = in.read()) != -1;) {
                out.write(b);
            }
            out.close();
            in.close();
            System.out.println("Station xmlfile saved.");
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Something went wrong...");
		}
	}
	
}

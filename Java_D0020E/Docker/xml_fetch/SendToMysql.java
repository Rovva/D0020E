package xml_fetch;

import java.sql.*;

public class SendToMysql {
	
	Connection myConnection = null;

    public SendToMysql() {
    	
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

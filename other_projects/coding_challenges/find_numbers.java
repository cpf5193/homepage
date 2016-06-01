import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class FindNumbers {
	static final String FILEPATH = "C:\\Users\\Chip\\workspace\\Vantage_Sports\\src\\";
	static final String FILENAME = "aol_queries.txt";
	
	/**
	 * @param args
	 * @throws FileNotFoundException if the file to search is not found
	 * main prints all of the found phone numbers in the accepted formats in the file to standard output
	 */
	public static void main(String[] args) throws FileNotFoundException {
		//regexes qualify accepted phone number formats
		String regex1 = "(1[-])?([0-9]{3}[-]){2}[0-9]{4}"; //format: 1-XXX-XXX-XXXX or XXX-XXX-XXXX
		String regex2 = "(1[-])?[(][0-9]{3}[)][-][0-9]{3}[-][0-9]{4}"; //format: 1-(XXX)-XXX-XXXX or (XXX)-XXX-XXXX
		String regex3 = "(1[-])?[(][0-9]{3}[)] [0-9]{3}[-][0-9]{4}"; //format: 1-(XXX) XXX-XXXX	or (XXX) XXX-XXXX
		String regex4 = "1?[0-9]{10}"; //format: 1XXXXXXXXXX or XXXXXXXXXX
		String[] regexes = {regex2, regex3, regex1, regex4}; //used for reduction of passed parameters
		String fullRegex = ".*" + regex1 + "|" + regex2 + "|" + regex3 + "|" + regex4 + ".*";
		Pattern pattern = Pattern.compile(fullRegex);
		Scanner reader = new Scanner(new File(FILEPATH + FILENAME));
		Set<String> matches = new TreeSet<String>();
		while(reader.hasNext()){
			String nextLine = reader.nextLine();
			Matcher matcher = pattern.matcher(nextLine);
			while(matcher.lookingAt()){//could match more than one number in the line, otherwise acts as if statement
				matches.add(nextLine.substring(matcher.start(), matcher.end()));
				matcher = pattern.matcher(nextLine.substring(matcher.end(), nextLine.length()));
			}
		}
		reader.close();
		//Using a TreeSet eliminates duplicates and keeps the list sorted
		Set<String> validNumbers = new TreeSet<String>();
		for(String s : matches)//extract just the phone numbers from the matched Strings
			validNumbers.add(extractNumber(s, regexes));
		for(String number : validNumbers)
			System.out.println(number);
	}
	
	/*
	 * @return the substring representing a phone number in the longest valid format
	 * @param s 
	 */
	private static String extractNumber(String s, String[] regexes) {
		//number will be at the end of each string, look for longest case first (16 characters long)
		//The comments to the side show the number format that is currently being looked for
		String toLookAt = s.substring(s.length()-17, s.length());//the string to be determined as a phone number or not
		Pattern pattern = Pattern.compile(regexes[0]);//1-(XXX)-XXX-XXXX
		Matcher matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		pattern = Pattern.compile(regexes[1]);//1-(XXX) XXX-XXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		toLookAt = toLookAt.substring(2);//(XXX)-XXX-XXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		pattern = Pattern.compile(regexes[2]);//(XXX) XXX-XXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		pattern = Pattern.compile(regexes[0]);//1-XXX-XXX-XXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		toLookAt = toLookAt.substring(1);//XXX-XXX-XXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		pattern = Pattern.compile(regexes[3]);
		toLookAt = toLookAt.substring(1);//1XXXXXXXXXX
		matcher = pattern.matcher(toLookAt);
		if(matcher.matches())
			return toLookAt;
		//only one possible format left that could have been matched
		else return toLookAt.substring(1);//XXXXXXXXXX
	}
}

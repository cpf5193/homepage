import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class BirthdayParadox {
	
	private static final int TIMES_TO_RUN = 1000;
	
	/**
	 * @param args class arguments, should be none
	 * main method prints out a double representing the average number of
	 * birthdays randomly generated until a duplicate is found over [TIMES_TO_RUN]
	 * iterations
	 */
	public static void main(String[] args) {
		int sum = 0;
		for(int i=0; i<TIMES_TO_RUN; i++)
			sum += numBirthdays();
		System.out.println(sum / (double)TIMES_TO_RUN);
	}
	
	/*
	 * @return the number of birthdays generated before a duplicate was found
	 */
	private static int numBirthdays(){
		Map<Integer, Integer> birthdays = new HashMap<Integer, Integer>();
		boolean duplicateFound = false;
		while(!duplicateFound){
			int bdIndex = generate();
			//will be true if this birthday number has already been generated, breaking loop on next check
			duplicateFound = birthdays.containsKey(bdIndex); 
			birthdays.put(bdIndex, 1); //value is arbitrary; simply needs to exist
		}
		//using keySet's size as a counter
		return birthdays.keySet().size()+1; //Must add 1 to account for the duplicate birthday
	}
	
	/*
	 * @return a random int from 1 to 365, representing a birth date
	 */
	private static int generate(){
		Random rand = new Random();
		return rand.nextInt(364)+1;
	}
}

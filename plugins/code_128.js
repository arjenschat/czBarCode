stringCode = "00 SP SP 00 11011001100,01 ! ! 01 11001101100,02 \" \" 02 11001100110,03 # # 03 10010011000,04 $ $ 04 10010001100,05 % % 05 10001001100,06 & & 06 10011001000,07 ' ' 07 10011000100,08 ( ( 08 10001100100,09 ) ) 09 11001001000,10 * * 10 11001000100,11 + + 11 11000100100,12 ; ; 12 10110011100,13 - - 13 10011011100,14 . . 14 10011001110,15 / / 15 10111001100,16 0 0 16 10011101100,17 1 1 17 10011100110,18 2 2 18 11001110010,19 3 3 19 11001011100,20 4 4 20 11001001110,21 5 5 21 11011100100,22 6 6 22 11001110100,23 7 7 23 11101101110,24 8 8 24 11101001100,25 9 9 25 11100101100,26 : : 26 11100100110,27 ; ; 27 11101100100,28 < < 28 11100110100,29 = = 29 11100110010,30 > > 30 11011011000,31 ? ? 31 11011000110,32 @ @ 32 11000110110,33 A A 33 10100011000,34 B B 34 10001011000,35 C C 35 10001000110,36 D D 36 10110001000,37 E E 37 10001101000,38 F F 38 10001100010,39 G G 39 11010001000,40 H H 40 11000101000,41 I I 41 11000100010,42 J J 42 10110111000,43 K K 43 10110001110,44 L L 44 10001101110,45 M M 45 10111011000,46 N N 46 10111000110,47 O O 47 10001110110,48 P P 48 11101110110,49 Q Q 49 11010001110,50 R R 50 11000101110,51 S S 51 11011101000,52 T T 52 11011100010,53 U U 53 11011101110,54 V V 54 11101011000,55 W W 55 11101000110,56 X X 56 11100010110,57 Y Y 57 11101101000,58 Z Z 58 11101100010,59 [ [ 59 11100011010,60 \ \ 60 11101111010,61 ] ] 61 11001000010,62 ^ ^ 62 11110001010,63 _ _ 63 10100110000,64 NUL ` 64 10100001100,65 SOH a 65 10010110000,66 STX b 66 10010000110,67 ETX c 67 10000101100,68 EOT d 68 10000100110,69 ENQ e 69 10110010000,70 ACK f 70 10110000100,71 BEL g 71 10011010000,72 BS h 72 10011000010,73 HT i 73 10000110100,74 LF j 74 10000110010,75 VT k 75 11000010010,76 FF l 76 11001010000,77 CR m 77 11110111010,78 SO n 78 11000010100,79 SI o 79 10001111010,80 DLE p 80 10100111100,81 DC1 q 81 10010111100,82 DC2 r 82 10010011110,83 DC3 s 83 10111100100,84 DC4 t 84 10011110100,85 NAK u 85 10011110010,86 SYN v 86 11110100100,87 ETB w 87 11110010100,88 CAN x 88 11110010010,89 EM y 89 11011011110,90 SUB z 90 11011110110,91 ESC { 91 11110110110,92 FS | 92 10101111000,93 GS } 93 10100011110,94 RS ~ 94 10001011110,95 US DEL 95 10111101000,96 FNC3 FNC3 96 10111100010,97 FNC2 FNC2 97 11110101000,98 SHIFT SHIFT 98 11110100010,99 CodeC CodeC 99 10111011110,100 CodeB FNC4 CodeB 10111101110,101 FNC4 Code A Code A 11101011110,102 FNC1 FNC1 FNC1 11110101110,103 STARTA STARTA STARTA 11010000100,104 STARTB STARTB STARTB 11010010000,105 STARTC STARTC STARTC 11010011100,106 STOP STOP STOP 11000111010"
arrayCode = stringCode.split(',')
CODE_128 = new Array;
for (var i=0; i<arrayCode.length;i++){			
	CODE_128[i]=arrayCode[i].match(/[01]{11}/);
	if (CODE_128[i]==null) alert('ERROR');
}
var	count = 0,
	checkSum = 0,
	stop =0;			

function draw_CODE_128(tagObj, inputCode){
	while (inputCode != '' && inputCode != null && count < 20) {
		//alert([count,inputCode])
		flag=0;
		//checkArray = check_input_code(inputCode);
		if (inputCode.search(/^\d{4,}/) != -1) {//has 4+ num in front
			if (count == 0) {
				start_code(tagObj,105);
			}else{
				continue_code(tagObj,99);
			}					
			while (pair = inputCode.match(/^\d{2}/)) {
				inputCode = jump_code(tagObj,inputCode,pair);
				flag = 1;
			}
		}// done for leading 4+ numbers	
		if (flag == 1) continue;
		// Always start with code B or continue with code B if 4+ num lead
		
		if (count == 0) {
			start_code(tagObj,104);
		}
		else {
			continue_code(tagObj,100);
		}		
		
		while (inputCode.search(/\B\d{6,}/) != -1) {// Check for middle range of 6+ num
			inputCode = walk_code(tagObj,inputCode);
			flag = 1;
		}// done with check in middle
		if (flag == 1) continue;	
		
		while (inputCode.search(/\d{4,}$/) != -1 ) {// Check for 4+ end
			if(inputCode.length % 2 == 0 && inputCode.search(/\D/)==-1){
				flag = 1; 
				break;
			} 
			inputCode = walk_code(tagObj,inputCode);
			flag=1;
		}// done with check at end
		if (flag == 1) continue;				
		while (inputCode != '') {
			inputCode = walk_code(tagObj, inputCode);
		}
	}
	// Check Sum Code
	codes = CODE_128[checkSum % 103] + '';
	//alert(checkSum%103);
	stop = draw_code(tagObj, codes, stop);
	// draw stop code
	codes = CODE_128[106]+'11';
	stop = draw_code(tagObj, codes, stop);			
	return --count;
}
function start_code(tagObj,index){
	codes = CODE_128[index] + '';
	checkSum += index;
	count++;
	stop = draw_code(tagObj, codes, START);
}	
function continue_code(tagObj,index){
	codes = CODE_128[index]+'';
	checkSum += index*count;
	count++;
	stop = draw_code(tagObj,codes,stop);
}
function walk_code(tagObj,inputCode){
	index = inputCode.charCodeAt(0) - 32;
	codes = CODE_128[index]+'';
	checkSum += index * count;
	count += 1;
	stop = draw_code(tagObj,codes,stop);
	return inputCode.substr(1);
}
function jump_code(tagObj,inputCode,pair){
	//alert(parseInt(pair,10))
	codes = CODE_128[parseInt(pair, 10)] + '';
	checkSum += (parseInt(pair, 10)) * count;
	count += 1;
	stop = draw_code(tagObj, codes, stop);
	return inputCode.substr(2);
}
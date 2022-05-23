 //红外温度传感器
function sensorTmp007Convert(tmpData){
	let SCALE_LSB = 0.03125 ;
	let rawAmbTemp = parseInt(tmpData.slice(2,4) + tmpData.slice(0,2),16);
	let rawObjTemp = parseInt(tmpData.slice(6,8) + tmpData.slice(4,6),16);
	let anmtemp = (rawAmbTemp >> 2) * SCALE_LSB;
	let objtemp = (rawObjTemp >> 2) * SCALE_LSB;
	return anmtemp;
}
//湿度传感器
function sensorHdc1000Convert (hdcData){
	let rawTemp = parseInt(hdcData.slice(2,4) + hdcData.slice(0,2),16);
	let rawHum = parseInt(hdcData.slice(6,8) + hdcData.slice(4,6),16);
	 //  - 计算温度[°C] 
	let temp = rawTemp / 65536 * 165 - 40 ;
	//  - 计算相对湿度[％RH] 
	let hum = rawHum / 65536 * 100;
	return hum;
}
//气压传感器
function calcBmp280(bmpData){
	let rawTemp = parseInt(bmpData.slice(4,6)+bmpData.slice(2,4)+bmpData.slice(0,2),16);
	let rawPa = parseInt(bmpData.slice(10,12)+bmpData.slice(8,10)+bmpData.slice(6,8),16);

	let temp = rawTemp / 100;
	let pa = rawPa / 100;
	return pa;
}
//光学传感器
function SensorOpt3001_convert(optData){
	let data = parseInt(optData.slice(2,4) + optData.slice(0,2),16)
	let e,m;
	m = data & 0x0FFF ; 
	e = (data & 0xF000) >> 12;
	/** e在4位存储在16位无符号=>它可以存储2 <<（e  -  1）与e <16 */ 
	e = ( e == 0 ) ? 1 : 2 << ( e - 1 );
	return m * (0.01 * e);
}

//df09 5efe 1f02 7001 2909 94ef 52ff 76ff 65fe
//Gyro - x  y  z -
function gyro(data){
	let gyroXdata = parseInt(data.slice(2,4) + data.slice(0,2),16);
	let gyroYdata = parseInt(data.slice(6,8) + data.slice(4,6),16);
	let gyroZdata = parseInt(data.slice(10,12) + data.slice(8,10),16);
	let gyroX = parseFloat((gyroXdata * 1) / (65536 / 500)).toFixed(1);
	let gyroY = parseFloat((gyroYdata * 1) / (65536 / 500)).toFixed(1);
	let gyroZ = parseFloat((gyroZdata * 1) / (65536 / 500)).toFixed(1);
	gyroX = gyroX > 255 ? (255 - gyroX).toFixed(1) : gyroX;
	gyroY = gyroY > 255 ? (255 - gyroY).toFixed(1) : gyroY;
	gyroZ = gyroZ > 255 ? (255 - gyroZ).toFixed(1) : gyroZ;
	return [gyroX,gyroY,gyroZ];
}

// Acc - x  y  z -
function acc(data,range){
	if(!range) range = 2
	let accXdata = parseInt(data.slice(14,16) + data.slice(12,14),16);
	let accYdata = parseInt(data.slice(18,20) + data.slice(16,18),16);
	let accZdata = parseInt(data.slice(22,24) + data.slice(20,22),16);
	let accX = parseFloat((accXdata * 1) / (32760 / range)).toFixed(1);
	let accY = parseFloat((accYdata * 1) / (32760 / range)).toFixed(1);
	let accZ = parseFloat((accZdata * 1) / (32760 / range)).toFixed(1);
	accX = accX > range? (range-accX).toFixed(1) : accX;
	accY = accY > range? (range-accY).toFixed(1) : accY;
	accZ = accZ > range? (range-accZ).toFixed(1) : accZ;

	return [accX,accY,accZ];
}

// mag - x  y  z -
function  mag(data){
	let magX = parseInt(data.slice(16,18) + data.slice(14,16),16);
	let magY = parseInt(data.slice(20,22) + data.slice(18,20),16);
	let magZ = parseInt(data.slice(24,26) + data.slice(22,24),16);
	return [magX*1.0,magY,magZ];
}
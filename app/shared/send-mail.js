import { error } from 'console';
import { sendEmail, mailOptions } from './node.mailer';
const fs = require('fs');
const util = require('util');
require('util.promisify').shim();
const readFile = util.promisify(fs.readFile);
import moment from 'moment';
moment.locale('de');
const path = require('path');



// export const sendContractEmail = async (employmentContract, cb) => {
//   let result;
//   const client = employmentContract.selectEmployee.client.companyName;
//   let subject = client+' - Arbeitsvertrag zum prüfen und unterzeichnen';
//   try {
//     result = await readFile(__dirname + '/employment-contract-link.html', 'utf8');

//     result = result.replace('{{firstName}}', employmentContract.firstName);
//     result = result.replace('{{lastName}}', employmentContract.lastName);
//     result = result.replace('{{client}}', client);
//     result = result.replace('{{client2}}', client);
    
//     result = result.replace('{{empRoles}}', employmentContract.empRoles);
//     result = result.replace('{{mobile}}', employmentContract.mobile);
//     result = result.replace('{{mainEmail}}', employmentContract.mainEmail);
//     result = result.replace('{{street}}', employmentContract.street);
//     result = result.replace('{{additionalAddress}}', employmentContract.additionalAddress);
//     result = result.replace('{{city}}', employmentContract.city);
//     result = result.replace('{{ahvNumber}}', employmentContract.ahvNumber);
//     result = result.replace('{{ibanNumber}}', employmentContract.ibanNumber);
//     result = result.replace('{{workload}}', employmentContract.workload);
//     result = result.replace('{{currentDate}}', moment().format('YYYY'));

//     let htmlStr = '';
//     htmlStr += '<table class="table col-6" style="border: none;"> <tbody>';
// 			for (const workingDayAndTime of employmentContract.workingDaysAndTimes) {				
// 				htmlStr += '<tr>' +
// 					'<th>' + workingDayAndTime.day + '</th>' +
// 					'<td>' + workingDayAndTime.from + ' - '+ workingDayAndTime.to +'</td>' +					
// 				'</tr>';
// 			}
// 		htmlStr += '</tbody></table> ';
//     result = result.replace('{{workingDaysAndTimes}}', htmlStr);

//     result = result.replace('{{entryDate}}', employmentContract.entryDate);
//     result = result.replace('{{endOfProbationaryPeriod}}', employmentContract.endOfProbationaryPeriod);
//     result = result.replace('{{exitDate}}', employmentContract.exitDate);
//     result = result.replace('{{vacationDays}}', employmentContract.vacationDays);
//     result = result.replace('{{wageType}}', employmentContract.wageType);
//     result = result.replace('{{wageAmount}}', employmentContract.wageAmount);
//     result = result.replace('{{wageAmountType}}', employmentContract.wageAmountType);
//     result = result.replace('{{signatureUrl}}', employmentContract.profileImageURL);
//     result = result.replace(/{{logo}}/g, `https://api.ocaapp.ch/api/employment-contracts/employment-contracts-credentials/emails/track/${employmentContract._id}/credentials/logo.png`);
    
//     result = result.replace('{{contractLink}}', `https://ocaapp.ch/public/contract/${employmentContract.contractToken}`);
    
   
//     const options = mailOptions(client, employmentContract.mainEmail || employmentContract.selectEmployee.email, subject, '', result);
//     sendEmail(options, cb);
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const sendUserCredentials = async (employmentContract, cb) => {
//   let result;
//   let subject = ' - Arbeitsvertrag zum prüfen und unterzeichnen';
//   try {
//     // result = await readFile(__dirname + '/offer-receipt-pdf.html', 'utf8');
//     result = await readFile(__dirname + '/employment-contract-link.html', 'utf8');

//     result = result.replace('{{name}}', employmentContract.name);
 
//     const options = mailOptions(employmentContract.email, '',  subject, '', result, '');
//     sendEmail(options, cb);
//   } catch (e) {
//     console.log(e);
//   }
// };
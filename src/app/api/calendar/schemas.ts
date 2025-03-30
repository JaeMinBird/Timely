import {z} from 'zod'

const timezoneSchema = z.string().refine((val) => {
try {
    // This tries to create a new Date object with the provided timezone
    Intl.DateTimeFormat(undefined, { timeZone: val });
    return true; // It's a valid timezone string
} catch (e) {
    return false; // Invalid timezone string
}
}, {
message: "Invalid timezone string",
}).describe('timezone of event time');

// // Define helper regex parts based on expected values
// const freqRegex = /^(SECONDLY|MINUTELY|HOURLY|DAILY|WEEKLY|MONTHLY|YEARLY)$/;
// const weekDayRegex = /^(MO|TU|WE|TH|FR|SA|SU)$/;
// const numberRegex = /^[0-9]+$/;

// // Define regex patterns to validate each RRULE component
// const rrulePattern = new RegExp([
// `(?:(FREQ)=${freqRegex.source})`, // Frequency (required)
// `(?:;(INTERVAL)=${numberRegex.source})?`, // Interval (optional)
// `(?:;(UNTIL)=(\\d{8}T\\d{6}Z))?`, // Until (optional, date-time in UTC)
// `(?:;(COUNT)=${numberRegex.source})?`, // Count (optional)
// `(?:;(BYSECOND)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By second (optional)
// `(?:;(BYMINUTE)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By minute (optional)
// `(?:;(BYHOUR)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By hour (optional)
// `(?:;(BYDAY)=(${weekDayRegex.source}(,${weekDayRegex.source})*))?`, // By day (optional)
// `(?:;(BYMONTHDAY)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By month day (optional)
// `(?:;(BYYEARDAY)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By year day (optional)
// `(?:;(BYWEEKNO)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By week number (optional)
// `(?:;(BYMONTH)=(1[012]|0?[1-9](,(1[012]|0?[1-9]))*))?`, // By month (optional)
// `(?:;(BYSETPOS)=(${numberRegex.source}(,${numberRegex.source})*))?`, // By set position (optional)
// `(?:;(WKST)=${weekDayRegex.source})?`, // Week start day (optional)
// ].join(''));

// Zod schema to validate the RRULE string
const rruleStringSchema = z.string().describe("RRULE string for handling reccuring events");


const eventSchema = z.object({
'summary': z.string().describe('summary of the event'),
'location': z.string().describe('location of the event'),
'description': z.string().describe('description of the event'),
'start': z.object({
    'dateTime': z.string(),
    'timeZone': timezoneSchema,
}).describe('starting time of the event'),
'end': z.object({
    'dateTime': z.string(),
    'timeZone': timezoneSchema
}).describe('ending time of event'),
'recurrence': z.array(
    rruleStringSchema
)
// 'attendees': z.array(
//     z.object({'email': z.string().email()})
// ).describe("list of attendees' emails")
// 'reminders': z.object({
//     'useDefault': z.boolean(),
//     'overrides': z.array(
//     //   {'method': 'email', 'minutes': 24 * 60},
//     //   {'method': 'popup', 'minutes': 10}
//     z.object({'method': z.string(), 'minutes': z.bigint().refine((val) => val > 0)})
//     )
// })
});
  
export const calendarSchema = z.object({"events": z.array(eventSchema).describe('list of all events in the calendar')});
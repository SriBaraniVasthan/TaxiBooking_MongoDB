/**
 * Database Connection
 */
db = connect('mongodb://localhost/taxidb');

/**
 * @author Leander Paul
 * @description Get top 10 highest earned driver details in this month (December 2022)
 */
db.revenues.aggregate([
  { $match: { year_month: 2212 } },
  { $sort: { money_earned: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'staffs', localField: 'driver_id', foreignField: '_id', as: 'driver' } },
  { $unwind: { path: '$driver' } },
  { $project: { name: { $concat: ['$driver.first_name', ' ', '$driver.last_name'] }, income: '$money_earned' } },
]);

/**
 * @author Leander Paul
 * @description Gets the total amount earned in each month, ordered in descending order of month
 */
db.revenues.aggregate([
  { $group: { _id: '$year_month', totalIncome: { $sum: '$money_earned' } } },
  { $sort: { _id: -1 } },
  {
    $addFields: {
      month: {
        $let: {
          vars: {
            monthsInString: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            monthInNum: { $subtract: [{ $mod: ['$_id', 100] }, 1] },
          },
          in: { $arrayElemAt: ['$$monthsInString', '$$monthInNum'] },
        },
      },
      year: { $add: [{ $floor: { $divide: ['$_id', 100] } }, 2000] },
    },
  },
  { $project: { _id: 0 } },
]);

/**
 * @author Leander Paul
 * @description Get top 10 customers with the most booking and without membership sorted in descending order of booking count
 */
db.bookings.aggregate([
  { $match: { customer_id: { $exists: true } } },
  { $group: { _id: '$customer_id', booking_count: { $sum: 1 } } },
  { $sort: { booking_count: -1 } },
  { $limit: 10 },
]);

/**
 * @author Leander Paul
 * @description Get the count of the customers who have membership
 */
db.customers.countDocuments({ client_details: { $exists: true } });

/**
 * @author Sri Barani Vasthan Varadharajan
 * @description  Gets the Top 20 bookings' payments using card payment method, sorted by amount
 */
db.bookings.aggregate([{ $match: { customer_id: { $exists: true, }, "payment.payment_method": "card", }, }, {$sort: { 'payment.amount': -1, }, },{$limit:20},{ $project:{booking_date:'$booking_date',payee_name:'$payment.payee_name',payment_method:'$payment.payment_method',amount:'$payment.amount', _id:0}}]);

/**
 * @author Sri Barani Vasthan Varadharajan
 * @description Gets the top 10 salary wages of permanent drivers sorted by highest wage
 */
 
db.staffs.aggregate([{ $match: {role: 'driver','employment_record.employment_type':'permanent' }, }, {$sort: { 'wage.salary': -1, }, },{$limit:10},{ $project: { name: { $concat: ['$first_name', ' ', '$last_name'] }, date_of_birth: 1, Salary :'$wage.salary', _id:0} }]);
 
 /**
 * @author Sri Barani Vasthan Varadharajan
 * @description Gets the list of cars which are not roadworthy sorted by last serviced date
 */
 
 db.cars.aggregate([{$match: {car_status:{ $not: { $eq: "roadworthy"}}}},{$skip:10},{$limit:10},{ $project:{ Name: "$car_owner_details.name",RegistrationNumber : "$registration_number",CarType: "$car_type",Model: "$model",InsuranceNumber: "$car_owner_details.car_insurance",LastServiceDate: "$last_service_date",CarStatus:'$car_status', _id:0}},{$sort: {LastServiceDate: 1}}]);
 
 /**
 * @author Sri Barani Vasthan Varadharajan
 * @description Gets the total no of booking of private clients who travelled on weekends
 */
 
 db.customers.aggregate([{$match: {$and: [{"client_details.booking_frequecy": "weekends"},{"client_details.client_type": "private"}]}},{$count: "Total No of Private Bookings in weekends"}])

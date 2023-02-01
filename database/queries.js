/**
 * Database Connection
 */
db = connect('mongodb://localhost/taxidb');


db.revenues.aggregate([
  { $match: { year_month: 2212 } },
  { $sort: { money_earned: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'staffs', localField: 'driver_id', foreignField: '_id', as: 'driver' } },
  { $unwind: { path: '$driver' } },
  { $project: { name: { $concat: ['$driver.first_name', ' ', '$driver.last_name'] }, income: '$money_earned' } },
]);


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


db.bookings.aggregate([
  { $match: { customer_id: { $exists: true } } },
  { $group: { _id: '$customer_id', booking_count: { $sum: 1 } } },
  { $sort: { booking_count: -1 } },
  { $limit: 10 },
]);


db.customers.countDocuments({ client_details: { $exists: true } });


db.bookings.aggregate([{ $match: { customer_id: { $exists: true, }, "payment.payment_method": "card", }, }, {$sort: { 'payment.amount': -1, }, },{$limit:20},{ $project:{booking_date:'$booking_date',payee_name:'$payment.payee_name',payment_method:'$payment.payment_method',amount:'$payment.amount', _id:0}}]);


 
db.staffs.aggregate([{ $match: {role: 'driver','employment_record.employment_type':'permanent' }, }, {$sort: { 'wage.salary': -1, }, },{$limit:10},{ $project: { name: { $concat: ['$first_name', ' ', '$last_name'] }, date_of_birth: 1, Salary :'$wage.salary', _id:0} }]);

 
 db.cars.aggregate([{$match: {car_status:{ $not: { $eq: "roadworthy"}}}},{$skip:10},{$limit:10},{ $project:{ Name: "$car_owner_details.name",RegistrationNumber : "$registration_number",CarType: "$car_type",Model: "$model",InsuranceNumber: "$car_owner_details.car_insurance",LastServiceDate: "$last_service_date",CarStatus:'$car_status', _id:0}},{$sort: {LastServiceDate: 1}}]);
 
 
 
 db.customers.aggregate([{$match: {$and: [{"client_details.booking_frequecy": "weekends"},{"client_details.client_type": "private"}]}},{$count: "Total No of Private Bookings in weekends"}])

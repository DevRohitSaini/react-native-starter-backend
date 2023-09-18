import BaseController from './base.controller';
import User from '../models/user';
import LogsController from './logs.controller';
import moment, { invalid } from 'moment';

class UsersController extends BaseController {
	whitelist = [
		'name',
		'mobile',
		'email',
		'street',
		'city',
		'postcode',
		'country',
		'addressCoordinates',
		'gender',
		'dob',
		'password',
		'profileImageURL',
		'profileImageDest',
		'status',
		'type',
		'deletionInfo'
	];

	_populate = async (req, res, next) => {
		if (req.params.id && req.params.id != 'newuser') {
			const {
				id,
			} = req.params;

			try {
				const user = await
					User.findById(id)
						.exec();

				if (!user) {
					const err = new Error('User not found.');
					err.status = 404;
					return next(err);
				}
				req.user = user;
				next();
			} catch (err) {
				console.log(err);
				next(err);
			}
		} else {
			next();
		}
	}

	search = async (req, res, next) => {
		let filter = {};
		let sort = {};

		if (req.query.sort && req.query.key) {
			sort = {
				[req.query.key]: [req.query.sort],
			};
		}

		// To get only those users which are not soft deleted
		if (eval(req.query.isDeleted) === false) {
			filter['deletionInfo'] = null;
		} else {
			filter['deletionInfo.isDeleted'] = true;
		}

		if (req.query.filter) {
			filter['$or'] = [];
			filter['$or'].push({
				'name': {
					'$regex': req.query.filter,
					'$options': 'i',
				},
			});
			filter['$or'].push({
				'mobile': {
					'$regex': req.query.filter,
					'$options': 'i',
				},
			});
			filter['$or'].push({
				'email': {
					'$regex': req.query.filter,
					'$options': 'i',
				},
			});

		}

		if (req.query.type) {
			filter.type = req.query.type;
		}

		try {

			const [results, itemCount] = await Promise.all([
				User.find(filter).sort(sort).limit(req.query.limit).skip(req.skip).exec(),
				User.countDocuments(filter),
			]);

			const pageCount = Math.ceil(itemCount / req.query.limit);

			res.json({
				object: 'list',
				page: {
					...req.query,
					totalPages: pageCount,
					totalElements: itemCount,
				},
				data: results,
			});
		} catch (err) {
			console.log('err=>', err);
			next(err);
		}
	}

	fetch = async (req, res) => {
		const user = req.user;

		if (!user) {
			return res.sendStatus(404);
		}
		const isSuccess = true;
		res.status(200).json({
			isSuccess,
			user: user
		});
	}

	create = async (req, res, next) => {
		const filter = req.body;

		if (!filter.type) {
			filter.type = 'user';
		}

		if (!filter.password) {
			filter.password = "123456"
		}

		

		const existingUser = await User.findOne({ 'mobile': req.body.mobile });
		if (existingUser) {
			const err = new Error('Mobile number already exist.');
			err.status = 401;
			return next(err);
		} else {

			const params = this.filterParams(filter, this.whitelist);
			let newUser = new User({
				...params,
				password: filter.password,
				type: filter.type,
				provider: 'local'
			});

			try {
				const user = await newUser.save();
				res.status(201).json({
					isSuccess: true,
					user: user
				});
			} catch (err) {
				if (err.status) {
					res.status(err.status).json({ isSuccess: false, message: err.message });
				} else {
					console.error('Error:', err);
					res.status(500).json({ isSuccess: false, message: 'Internal server error' });
				}
			}
		}
	}

	update = async (req, res, next) => {
		let user = req.body;
		let updatedUser = Object.assign(req.user, user);
		try {
			const savedUser = await updatedUser.save();
			const isSuccess = true;
			res.status(200).json({
				isSuccess,
				savedUser
			});
		} catch (err) {
			console.log('err=>', err);
			next(err);
		}
	}

	delete = async (req, res, next) => {
		if (!req.user) {
			return res.sendStatus(403);
		}

		try {
			req.user.deletionInfo = {
				userIP: LogsController.extractIp(req),
				userName: req.currentUser.name,
				userID: req.currentUser._id,
				timestamp: moment.utc().format(),
				isDeleted: true
			};
			await req.user.save();
			res.status(200).json({
				isSuccess: true
			});
		} catch (err) {
			console.log('err=>', err);
			next(err);
		}
	}

}
export default new UsersController();

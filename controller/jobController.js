const jobsModel = require('../model/jobModel');
const moment = require('moment');
const createJobController = async (req, res, next) => {
    const { company, position } = req.body;

    if (!company || !position) {
        return next("Please Provide All Fields");
    }

    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({ job });

};
const editJobController = async (req, res, next) => {
    const id = req.params.id;
    const { company, position } = req.body;

    const job = await jobsModel.findOne({ _id: id });
    if (!job) {
        next('Jobs not exists fot this id');
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('Jobs not exists fot this id');
        return;
    }
    const updatejob = await jobsModel.findOneAndupdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).send({
        updatejob
    });


};

// we will use query string for filtering 
const getAllJobsController = async (req, res, next) => {
    // const jobs = await jobsModel.find({ createdBy: req.user.userId });

    const { status, workType, search, sort } = req.query;

    // Conditions for Searching Filters
    const queryObject = {
        createdBy: req.user.userId,
    };
    // logic filters

    if (status && status !== 'all') {
        queryObject.status = status;
    }
    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }

    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }

    let queryResult = jobsModel.find(queryObject);

    // sorting 
    if (sort === 'latest') {
        queryResult = queryResult.sort('-createdAt');
    }

    if (sort === 'oldest') {
        queryResult = queryResult.sort('createdAt');
    }
    if (sort === 'a-z') {
        queryResult = queryResult.sort('position');
    }
    if (sort === 'z-a') {
        queryResult = queryResult.sort('-position');
    }

    // pagination
    const page= Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip=(page-1) * limit;

    queryResult= queryResult.skip(skip).limit(limit);

    const totalJobs=await jobsModel.countDocument(queryResult);

    const numOfpage=Math.ceil(totaljobs/limit);


    const jobs = await queryResult;

    res.status(201).send({ totalJobs,jobs ,numOfpage});
};

const deleteJobController = async (req, res, next) => {
    const job = await jobsModel.findOne({ _id: id });
    if (!job) {
        next('Job not exists');
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('user not authorizised');
        return;
    }
    await job.remove();
    res.status(201).send({ message: 'job deleted' });

};

// add filter
const jobStatsController = async (req, res, next) => {
    const stats = await jobsModel.aggregate([
        // search by user job
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            }

        },
        {
            $group: {
                _id: '$status', count: { $sum: 1 }
            }
        }
    ]);
    // default stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    }

    // monthly stats
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createAt' },
                    month: { $month: '$createAt' }
                },
                count: { $sum: 1 }
            }
        }

    ]);
    // format date and months and year
    monthlyApplication = monthlyApplication.map((item, ind) => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');

        return date, count;
    }).reverse();

    res.status(200).send({
        totalJobs: stats.length,
        stats,
        defaultStats,
        monthlyApplication
    });

}

module.exports = {
    createJobController, getAllJobsController, deleteJobController, editJobController, jobStatsController
};

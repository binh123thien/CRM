'use strict';

const bcrypt = require('bcrypt');
const utils = require('./../_helper/utils');
const jobData = require('./database/data');
const constant = require('./../_core/constant');
const moment = require('moment');

const getlist = async(req, res) => {
    try {
        // nếu ỦRL chưa đúng định dạng (có truy vấn page) thì đổi lại cho đúng
        if (!req.query.page) {
            res.redirect('/job/list?page=1');
        }
        const size = 50;
        //nếu có page thì hiện page còn không có page thì hiện 1
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const _dataList = {
            offset: (page - 1) * size,
            limit: size,
            user_id: req.user.id,
            status: "show"
        };
        // Kiểm tra xem có tìm kiếm hay không
        if (req.query.key) {
            _dataList.keyword = utils.Trim(req.query.key);
        }
        //query find all and count
        const jobs = await jobData.queryJobs(_dataList);
        //phân trang
        const paging = utils.Paging(req.originalUrl, jobs.count, size, page);
        //dieu kien hien thi doi moi truong cong ty

        res.render('pages/job/list_job', {
            title: 'Danh sách ngành nghề',
            page_title: 'Quản lý ngành nghề',
            folder: 'Menu',
            req,
            jobs,
            //phân trang
            size,
            paging,
        });
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postlist = async(req, res) => {
    try {
        //lấy giá trị từ from
        const data = {
            user_id: req.user.id,
            full_name: utils.Trim(req.body.title),
            status: "show",
        };
        //thêm
        if (data) {
            const full_name = await jobData.findBy({
                user_id: data.user_id,
                full_name: data.full_name,
                status: "show"
            });
            if (full_name) {
                req.flash('error_messages', 'Thất bại! Ngành nghề đã tồn tại');
                res.redirect('back');
            } else {
                await jobData.jobCreate(data);
                req.flash('success_messages', 'Thêm thành công!');
            }
        } else {
            req.flash('error_messages', 'Không tìm thấy!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const post_job_update = async(req, res) => {
    try {
        //tìm id trong db Job cần sửa
        const job = await jobData.findBy({
            id: req.params.jobId,
        });
        //nếu tìm thấy id job cần sửa
        if (job) {
            const full_name = await jobData.findBy({
                user_id: req.user.id,
                full_name: utils.Trim(req.body.jobs),
                status: "show",
            });
            if (full_name) {
                req.flash('error_messages', 'Thất bại! Ngành nghề đã tồn tại');
                res.redirect('back');
            } else {
                // update tag
                job.update({
                    full_name: utils.Trim(req.body.jobs),
                });
                req.flash('success_messages', 'Thành công!');
            }
        } else {
            req.flash('error_messages', 'Thất bại!');
        }
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
const post_job_delete = async(req, res) => {
    try {
        //tìm id trong db Job cần xóa
        const job = await jobData.findBy({
            id: req.params.jobId
        });
        //nếu tìm thấy id job cần xóa
        if (job) {
            // delete job
            job.update({
                status: 'hidden'
            });
            req.flash('success_messages', 'Thành công!');
        } else {
            req.flash('error_messages', 'Thất bại!');
        }
        res.redirect('back')
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

//search
const post_job_search = async(req, res) => {
    try {
        if (utils.Trim(req.body.key).length > 0) {
            res.redirect('/job/list?page=1&key=' + utils.Trim(req.body.key));
        } else {
            res.redirect('/job/list?page=1');
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};
const postSearchNext = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page + 1;
        if (!req.params.key) {
            res.redirect('/job/list?page=' + page);
        } else {
            res.redirect('/job/list?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postSearchPrevious = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page - 1;
        if (!req.params.key) {
            res.redirect('/job/list?page=' + page);
        } else {
            res.redirect('/job/list?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};


module.exports = {
    getlist,
    postlist,
    post_job_update,
    post_job_delete,
    post_job_search,
    postSearchNext,
    postSearchPrevious,
};
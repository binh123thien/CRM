const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/list', [permission.mustLogin],
    service.getlist
)

router.post(
    '/list', [permission.mustLogin],
    service.postlist
)

router.post(
    '/detail/:jobId/update', [permission.mustLogin],
    service.post_job_update
)

router.post(
    '/detail/:jobId/delete', [permission.mustLogin],
    service.post_job_delete
)

//search
router.post(
    '/search', [permission.mustLogin],
    service.post_job_search
)

router.post(
    '/search/Next/:page', [permission.mustLogin],
    service.postSearchNext
)

router.post(
    '/search/Next/:page/:key', [permission.mustLogin],
    service.postSearchNext
)

router.post(
    '/search/Previous/:page', [permission.mustLogin],
    service.postSearchPrevious
)

router.post(
    '/search/Previous/:page/:key', [permission.mustLogin],
    service.postSearchPrevious
)

module.exports = router;
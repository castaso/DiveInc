const cron = require('node-cron');

const Op = require('sequelize').Op
const sequelize = require('@helpers/database')

const transactionResort = require('@models').transaction_resort; 
const transactionDivecenter = require('@models').transaction_divecenter; 
const transactionLiveaboard = require('@models').transaction_liveaboard; 

const resort = require('@models').resort; 
const divecenter = require('@models').divecenter; 
const liveaboard = require('@models').liveaboard; 

const user = require('@models').user;

const template = require(`@helpers/template`)
const mailService = require(`@service/email`)

module.exports = {
    runCronReminderScheduleResort : async () => {
        // run cron at midnight
        cron.schedule('0 0 * * *', async function() {
            let dataResort = await transactionResort.findAll({
                where : {
                    transaction_resort_status_id : "bcc8ff37-468f-45cb-bccc-fd34cce4b8ac"
                },
                include : [
                    {
                        model : resort,
                        include : [
                            user
                        ]
                    }
                ]
            })

            for(var i = 0; i < dataResort.length; i++){
                let emailReminder = await template.emailReminderSchedule(dataResort[i].dataValues)
                mailService(emailReminder)
            }
        });
    },
    runCronDoneResort : async () => {
        // run cron at midnight
        cron.schedule('0 0 * * *', async function() {
            let dataResort = await transactionResort.findAll({
                where : {
                    //transaction_resort_status_id : "bcc8ff37-468f-45cb-bccc-fd34cce4b8ac",
                    [Op.or] : [
                        // {
                        //     package_data : {
                        //         room_date : {
                        //             to : "2021-02-12"
                        //         }
                        //     }
                        // },
                        {
                            package_data : {
                                package : {
                                    packageItem : {
                                        package_date : "2021-02-10"
                                    }
                                }
                            }
                        }
                    ]
                },
                include : [
                    {
                        model : resort,
                        include : [
                            user
                        ]
                    }
                ]
            })

            for(var i = 0; i < dataResort.length; i++){
                // process dataResort[i]
            }
        });
    }
}

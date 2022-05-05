const { CommandInteraction, Client, MessageEmbed, MessageAttachment } = require("discord.js")
const { connection } = require("mongoose");
const { execute } = require("../../events/client/ready");

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const DB = require('../../structures/schemas/ClientDB');
const moment = require("moment");

require("../../Events/Client/ready");
require("moment-duration-format");

function getPBar(percent) {
    let thick = Math.floor(percent / 5);
    let thin = Math.ceil((100 - percent) / 10) * 2;
    let str = " [";

    for (let i = 0; i < thick; i++) str += "▰";
    for (let i = 0; i < thin; i++) str += "▱";

    str += "] ";
    return str;
}

module.exports = {
    name: "status",
    description: 'Bot status.',
    async execute(client, interaction, color) {
        try {

            const docs = await DB.findOne({
                Client: true
            });

            const mem0 = docs.Memory[0];
            const mem1 = docs.Memory[1];
            const mem2 = docs.Memory[2];
            const mem3 = docs.Memory[3];
            const mem4 = docs.Memory[4];
            const mem5 = docs.Memory[5];
            const mem6 = docs.Memory[6];
            const mem7 = docs.Memory[7];
            const mem8 = docs.Memory[8];
            const mem9 = docs.Memory[9];
            const mem10 = docs.Memory[10];
            const mem11 = docs.Memory[11];
            const mem12 = docs.Memory[12];

            const avgMem = (mem0 + mem1 + mem2 + mem3 + mem4 + mem5 + mem6 + mem7 + mem8 + mem9 + mem10 + mem11 + mem12) / 13;

            const colors = {
                purple: {
                    default: "rgba(149, 76, 233, 1)",
                    half: "rgba(149, 76, 233, 0.5)",
                    quarter: "rgba(149, 76, 233, 0.25)",
                    low: "rgba(149, 76, 233, 0.1)",
                    zero: "rgba(149, 76, 233, 0)"
                },
                indigo: {
                    default: "rgba(80, 102, 120, 1)",
                    quarter: "rgba(80, 102, 120, 0.25)"
                },
                green: {
                    default: "rgba(92, 221, 139, 1)",
                    half: "rgba(92, 221, 139, 0.5)",
                    quarter: "rgba(92, 221, 139, 0.25)",
                    low: "rgba(92, 221, 139, 0.1)",
                    zero: "rgba(92, 221, 139, 0)"
                },
            };

            const memData = [
                mem0,
                mem1,
                mem2,
                mem3,
                mem4,
                mem5,
                mem6,
                mem7,
                mem8,
                mem9,
                mem10,
                mem11,
                mem12,
            ];

            const labels = [
                '60',
                '55',
                '50',
                '45',
                '40',
                '35',
                '30',
                '25',
                '20',
                '15',
                '10',
                '5',
            ];

            const width = 1500;
            const height = 720;

            const plugin = {
                id: 'mainBg',
                beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillStyle = '#192027';
                    ctx.fillRect(0, 0, chart.width, chart.height);
                    ctx.restore();
                }
            }

            const chartCallback = (ChartJS) => { }
            const canvas = new ChartJSNodeCanvas({
                width: width,
                height: height,
                plugins: {
                    modern: [require('chartjs-plugin-gradient')],
                },
                chartCallback: chartCallback
            })

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'RAM Usage',
                        fill: true,
                        backgroundColor: colors.green.low,
                        pointBackgroundColor: colors.green.default,
                        borderColor: colors.green.default,
                        data: memData,
                        lineTension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3
                    },
                ],
            }

            const chartConfig = {
                type: "line",
                data: chartData,
                options: {
                    layout: {
                        padding: 10
                    },
                    responsive: false,
                    plugins: {
                        legend: {
                            display: true,
                        }
                    },
                    scales: {
                        xAxes: {
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                padding: 10,
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        },
                        yAxes: {
                            scaleLabel: {
                                display: true,
                                labelString: "Usage",
                                padding: 10
                            },
                            gridLines: {
                                display: true,
                                color: colors.indigo.quarter
                            },
                            ticks: {
                                beginAtZero: false,
                                max: 63,
                                min: 57,
                                padding: 10
                            }
                        }
                    }
                },
                plugins: [plugin]
            }

            const image = await canvas.renderToBuffer(chartConfig);
            const attachment = new MessageAttachment(image, 'chart.png');


            if (!docs || docs.Memory.length < 12) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle('🛑 No Data Found!')
                            .setDescription('Please Wait For The Information To Be Collected!')
                    ],
                    ephemeral: true
                }).catch(err => console.log(err));
            

            require('../../events/client/ready');

            let embedColor;

            const mongoose = require('mongoose');
            let dbConnection;
            if (mongoose.connection.readyState === 0) { dbConnection = "<:dnd:938818583939649556>\`DISCONNECTED\`"; embedColor = "RED"; }
            if (mongoose.connection.readyState === 1) { dbConnection = "<:online:938818583868366858>\`CONNECTED\`"; embedColor = "GREEN"; }
            if (mongoose.connection.readyState === 2) { dbConnection = "<:idle:938818583864180796>\`CONNECTING\`"; embedColor = "YELLOW"; }
            if (mongoose.connection.readyState === 3) { dbConnection = "<:idle:938818583864180796>\`DISCONNECTING\`"; embedColor = "ORANGE"; }


            const embed = new MessageEmbed()
                .setTitle(`${client.user.username} Status`)
                .setDescription(`**Client:** \`✅ ONLINE\` - \`${client.ws.ping}ms\`\n**Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Database:** ${dbConnection}\nAverage RAM Usage**: ${avgMem.toFixed(2)}GB`)
                .setColor(embedColor)
                .setImage('attachment://chart.png')
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
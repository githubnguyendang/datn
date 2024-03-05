
import React from 'react';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { Description } from '@mui/icons-material';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import DialogControlShowPDF from 'src/@core/components/show-file-pdf/dialog';


// Register font
Font.register({ family: 'Roboto Slab', src: '/font/Roboto/Roboto-Regular.ttf' });

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        padding: '2cm',
        fontFamily: "Roboto Slab",
    },
    header: {
        fontSize: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        lineHeight: 1.5
    },
    headerLeft: {
        width: '50%',
        textAlign: 'center',
    },
    headerRight: {
        width: '50%',
        textAlign: 'center',
    },
    title: {
        marginVertical: 35,
        fontSize: 18,
        textAlign: 'center',
    },
    body: {
        flexGrow: 1,
        fontSize: 13,
        lineHeight: 2,
    },
    footer: {
        fontSize: 12,
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
});


interface ForecastNewsletterContentProps {
    data: any;
}

const ForecastNewsletterContent: React.FC<ForecastNewsletterContentProps> = ({ data }) => {

    return (
        <PDFViewer showToolbar style={{ width: '100%', height: '100%' }} >
            <Document>
                <Page size="A4" style={styles.page} fixed>
                    <View style={styles.header}>
                        <View style={styles.headerLeft} >
                            <Text style={[styles.bold]}>UBND Tỉnh Quảng Ngãi</Text>
                            <Text >SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG</Text>
                            <Text style={{ fontSize: 10 }} >Số:.........../STNMT-TNN-KS&KTTV</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <Text >CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
                            <Text style={styles.bold}>Độc lập - Tự do - Hạnh phúc</Text>
                            <Text >Quảng Ngãi, ngày {dayjs().date()}, tháng {dayjs().month() + 1}, năm {dayjs().year()}</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>BÁO CÁO DỰ BÁO LŨ LỤT</Text>
                    <View style={styles.body}>
                        <Text>Dự báo tại {data.station.name}, thuộc sông Trà Khúc, tỉnh Quảng Ngãi</Text>
                        <Text>Ngày: {data.date}</Text>
                        <Text>Lượng mưa dự báo: {data.amount_rain} (mm)</Text>
                        <Text>Mực nước dự báo: {data.water_level_prediction} (cm)</Text>
                        <Text>
                            Đánh giá: {
                                data.water_level_prediction >= data.station.alarm_level1 && data.water_level_prediction < data.station.alarm_level2 ? 'Mức báo động I' :
                                    data.water_level_prediction >= data.station.alarm_level2 && data.water_level_prediction < data.station.alarm_level3 ? 'Mức báo động II' :
                                        data.water_level_prediction > data.station.alarm_level3 ? 'Mức báo động III' :
                                            'Mực nước bình thường'}
                        </Text>

                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        {data.chartURL ? <Image src={data.chartURL} /> : null}
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text>Nơi nhận</Text>
                            <Text>- Ban Giám đốc sở</Text>
                            <Text>- Lưu: VT; TNN, KS&KTTV; VP, 10b</Text>
                        </View>
                        <View>
                            <Text>Người thống kê</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer >
    );
};

interface ForecastNewsletterProps {
    data?: any;
    onClick?: () => void;
}

const ForecastNewsletter: React.FC<ForecastNewsletterProps> = ({ data, onClick }) => {
    const formTitle = ``;

    return (
        <DialogControlShowPDF>
            {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void) => (
                <Button variant='outlined' endIcon={<Description />} onClick={
                    () => {
                        if (onClick) {
                            onClick(); // Only call onClick if it's defined
                        }
                        openDialogs(<ForecastNewsletterContent data={data} />, formTitle)
                    }

                }>
                    Tạo báo cáo
                </Button>
            )
            }
        </DialogControlShowPDF >
    );
};

export default ForecastNewsletter;


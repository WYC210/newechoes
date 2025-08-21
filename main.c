
#include <stdio.h>
//���������Ƿ�Ϊ���ֽ����ж�

#define LOW 15
//�洢�˻����̵�����
int singlePoint[LOW][LOW];
int single_low = 0;//��
int single_row = 0;//��
int max = 0;//����洢�������

//�ж�ѡ��ģʽ
int decide = 0;

// ʵ�ֳ�ʼ����ͼ
void Made_map(char arr[LOW][LOW]) {
    // ��ʼ����ͼ
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            arr[i][j] = '-';
        }
    }
}

// ʵ�������ͼ
void Print_map(char arr[LOW][LOW]) {
    printf("    ");
    for (int i = 0; i < LOW; i++) {
        if (i < 10) //����ڼ���
        {
            printf(" %d  ", i);
        } else {
            printf("%d  ", i);
        }
    }
    printf("\n");
    for (int i = 0; i < LOW; i++)//�����������
    {
        if (i < 10) //����ڼ���
        {
            printf(" %d", i);
        } else {
            printf("%d", i);
        }
        for (int j = 0; j < LOW; j++) //������̺���
        {
            printf("   %c", arr[i][j]);
        }
        if (i < 10) //����ڼ���
        {
            printf("   %d", i);
        } else {
            printf("   %d", i);
        }
        printf("\n");//�����ÿһ�Ż���
    }
    printf("    ");
    for (int i = 0; i < LOW; i++) {
        if (i < 10) //����ڼ���
        {
            printf(" %d  ", i);
        } else {
            printf("%d  ", i);
        }
    }
    printf("\n");
}

//������
void clearPoint() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

// ʵ����������ƶ�
int Move(char arr[LOW][LOW], char player, int row, int col) {
    // �쳣����
    if (scanf("%d %d", &row, &col) != 2) {
        printf("******************\n ��Ч�����룬���������� \n******************\n");
        //������
        clearPoint();
        return 0;
    }
    if (row < 0 || row >= LOW || col < 0 || col >= LOW || arr[row][col] != '-') {
        printf("******************\n ��Ч�����룬���������� \n******************\n");
        //������
        clearPoint();
        return 0;
    }
    // ���������������滻���������Ӧ��λ��
    arr[row][col] = player;
    return 1;
}

//�����Ƿ�ʤ��
int CheckWin(char arr[LOW][LOW], char player) {
    //���˼��
    if (decide != 1) {
        //������
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == player && arr[i][j + 1] == player && arr[i][j + 2] == player &&
                    arr[i][j + 3] == player &&
                    arr[i][j + 4] == player) {
                    printf("===================\n%cʤ��!\n===================\n", player);
                    return 1;
                }
            }
        }

        // �������
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[j][i] == player && arr[j + 1][i] == player && arr[j + 2][i] == player &&
                    arr[j + 3][i] == player &&
                    arr[j + 4][i] == player) {
                    printf("===================\n%cʤ��!\n===================\n", player);
                    return 1;
                }
            }
        }

        // ���б�����ϵ����£�
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == player && arr[i + 1][j + 1] == player && arr[i + 2][j + 2] == player &&
                    arr[i + 3][j + 3] == player && arr[i + 4][j + 4] == player) {
                    printf("===================\n%xʤ��!\n===================\n", player);
                    return 1;
                }
            }
        }

        // ���б�����ϵ����£�
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 4; j < LOW; j++) {
                if (arr[i][j] == player && arr[i + 1][j - 1] == player && arr[i + 2][j - 2] == player &&
                    arr[i + 3][j - 3] == player && arr[i + 4][j - 4] == player) {
                    printf("===================\n%cʤ��!\n===================\n", player);
                    return 1;
                }
            }
        }
    }
    //�˻����
    if (decide == 1) {
        //������
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                    arr[i][j + 4] == 'Y') {
                    printf("===================\n�˻�ʤ��!\n===================\n");
                    return 1;
                }
            }
        }

        // �������
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[j][i] == 'Y' && arr[j + 1][i] == 'Y' && arr[j + 2][i] == 'Y' && arr[j + 3][i] == 'Y' &&
                    arr[j + 4][i] == 'Y') {
                    printf("===================\n�˻�ʤ��!\n===================\n");
                    return 1;
                }
            }
        }

        // ���б�����ϵ����£�
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                    arr[i + 3][j + 3] == 'Y' && arr[i + 4][j + 4] == 'Y') {
                    printf("===================\n�˻�ʤ��!\n===================\n");
                    return 1;
                }
            }
        }

        // ���б�����ϵ����£�
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 4; j < LOW; j++) {
                if (arr[i][j] == 'Y' && arr[i + 1][j - 1] == 'Y' && arr[i + 2][j - 2] == 'Y' &&
                    arr[i + 3][j - 3] == 'Y' && arr[i + 4][j - 4] == 'Y') {
                    printf("===================\n�˻�ʤ��!\n===================\n");
                    return 1;
                }
            }
        }
    }
    return 0;

}
/*
 * ���壬���ģ����ģ�������������������߶�
 */

//���������еĻ���
void Clean() {
    for (int i = 0; i < 15; ++i) {
        for (int j = 0; j < 15; ++j) {
            singlePoint[i][j] = 0;
        }
    }
}

//����,��������
void DefensePoint(char arr[LOW][LOW], int singlePoint[LOW][LOW]) {
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            //�жϺ������ YYYY- ||-YYYY
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == '-' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' &&
                arr[i][j + 3] == 'X') {
                if (arr[i][j + 4] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j + 4] += 400;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j - 1] += 400;
                }
            }
            //�ж��������
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == '-' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' &&
                arr[i + 3][j] == 'X') {
                if (arr[i + 4][j] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 4][j] += 400;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j] += 400;
                }
            }
            //�ж�б���������»���
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' &&
                arr[i + 3][j + 3] == 'X') {
                if (arr[i + 4][j + 4] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 4][j + 4] += 400;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j - 1] += 400;
                }
            }
            //��������
            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == 'X' && arr[i - 3][j + 3] == 'X' &&
                arr[i - 4][j + 4] == '-' ||
                arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == 'X' && arr[i - 3][j + 3] == 'X' &&
                arr[i + 1][j - 1] == '-') {
                if (arr[i - 4][j + 4] == '-') {
                    singlePoint[i - 4][j + 4] += 400;
                } else {
                    singlePoint[i + 1][j - 1] += 400;
                }
            }
            //�жϺ������
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'X' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == 'X') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i][j + 3] == '-') {
                    singlePoint[i][j + 3] += 400;
                } else if (arr[i][j + 1] == '-') {
                    singlePoint[i][j + 1] += 400;
                } else {
                    singlePoint[i][j + 2] += 400;
                }
            }
            //�ж��������
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'X' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i + 4][j] == 'X') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 400;
                } else if (arr[i + 1][j] == '-') {
                    singlePoint[i + 1][j] += 400;
                } else {
                    singlePoint[i + 3][j] += 400;
                }
            }
            //�ж�б���������³���
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i + 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == '-' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == 'X') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i + 3][j + 3] == '-') {
                    singlePoint[i + 3][j + 3] += 400;
                } else if (arr[i + 1][j + 1] == '-') {
                    singlePoint[i + 1][j + 1] += 400;
                } else {
                    singlePoint[i + 2][j + 2] += 400;
                }
            }

            //б���������ϳ���
            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-' && arr[i - 3][j + 3] == 'X' &&
                arr[i - 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == 'X' && arr[i - 3][j + 3] == '-' &&
                arr[i - 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'X' && arr[i - 3][j + 3] == 'X' &&
                arr[i - 4][j + 4] == 'X') {
                if (arr[i - 2][j + 2] == '-') {
                    singlePoint[i - 2][j + 2] += 400;
                } else if (arr[i - 3][j + 3] == '-') {
                    singlePoint[i - 3][j + 3] += 400;
                } else {
                    singlePoint[i - 1][j + 1] += 400;
                }
            }
            //�жϻ��� -YYY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i][j + 3] += 200;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i][j - 1] += 200;
            }
            //�ж��������
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i + 3][j] += 200;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i - 1][j] += 200;
            }
            //�ж�б���������»���
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i + 3][j + 3] += 200;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i - 1][j - 1] += 200;
            }
            //б�����������»���
            if (arr[i][j] == 'X' && arr[i + 1][j - 1] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-' &&
                arr[i + 2][j - 2] == '-' ){
                singlePoint[i -2][ j + 2] += 200;
                singlePoint[i + 2][ j -2] +=200;
            }
            //�жϺ������� YYY- || -YYY
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == 'Y' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' &&
                arr[i][j + 3] == 'Y') {
                if (arr[i][j + 3] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j + 3] += 80;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j - 1] += 80;
                }
            }
            //�ж���������
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == 'Y' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' &&
                arr[i + 3][j] == 'Y') {
                if (arr[i + 3][j] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 3][j] += 80;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j] += 80;
                }
            }
            //�ж�б��������������
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == 'Y' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' &&
                arr[i + 3][j + 3] == 'Y') {
                if (arr[i + 3][j + 3] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 3][j + 3] += 80;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j - 1] += 80;
                }
            }
            //�ж�б������������
            if(arr[i][j] == 'X' && arr[i -1][j + 1] == 'X' && arr[i - 2][j + 2] =='X' && arr[i - 3][j + 3] =='Y' && arr[i +1][j -1] =='-' || arr[i][j] == 'X' && arr[i -1][j + 1] == 'X' && arr[i - 2][j + 2] =='X' && arr[i - 3][j + 3] =='-' && arr[i +1][j -1] =='Y'){
                if(arr[i +1][j -1] =='-'){
                    singlePoint[i + 1][ j -1] +=80;
                } else{
                    singlePoint[i - 3][j + 3] +=80;
                }
            }

            //X-X����
            if (arr[i][j] == 'X' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'X') {
                singlePoint[i][j + 1] += 100;
            }
            //����
            if (arr[i][j] == 'X' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'X') {
                singlePoint[i + 1][j] += 100;
            }
            //б��
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'X') {
                singlePoint[i + 1][j+ 1] += 100;
            }
            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'X') {
                singlePoint[i - 1][j + 1] += 100;
            }
            //������ -YY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j - 1] == '-') {
                singlePoint[i][j - 1] += 40;
                singlePoint[i][j + 2] += 40;

            }
            //������
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i - 1][j] == '-') {
                singlePoint[i - 1][j] += 40;
                singlePoint[i + 2][j] += 40;
            }
            //б����
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == '-') {
                singlePoint[i - 1][j - 1] += 40;
                singlePoint[i + 2][j + 2] += 40;

            }

            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-' && arr[i + 1][j - 1] == '-') {
                singlePoint[i - 2][j + 2] += 40;
                singlePoint[i + 1][j - 1] += 40;
            }
            //�����߶� YXX-|| YY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j - 1] == 'Y' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'Y') {
                if (arr[i][j + 2] == '-') {
                    singlePoint[i][j + 2] += 5;
                } else {
                    singlePoint[i][j - 1] += 5;
                }
            }
            //�����߶�
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i - 1][j] == 'Y' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'Y') {
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 5;
                } else {
                    singlePoint[i - 1][j] += 5;
                }
            }
            //б���߶�
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == 'Y' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'Y') {
                if (arr[i + 2][j + 2] == '-') {
                    singlePoint[i + 2][j + 2] += 5;
                } else {
                    singlePoint[i - 1][j - 1] += 5;
                }
            }
            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == 'Y' && arr[i + 1][j - 1] == '-' ||
                arr[i][j] == 'X' && arr[i + 1][j - 1 == 'Y' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-']) {
                if (arr[i + 1][j - 1] == '-') {
                    singlePoint[i + 1][j - 1] += 5;
                } else {
                    singlePoint[i - 2][j + 2] += 5;
                }
            }
            //-------------------------------------------------------����---------------------------------------------
            //�жϺ������ YYYY- ||-YYYY
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == '-'  ||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' &&
                arr[i][j + 3] == 'Y') {
                if (arr[i][j + 4] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j + 4] += 500;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j - 1] += 500;
                }
            }
            //�ж��������
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == '-' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' &&
                arr[i + 3][j] == 'Y') {
                if (arr[i + 4][j] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 4][j] += 500;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j] += 500;
                }
            }
            //�ж�б���������»���
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                arr[i + 3][j + 3] == 'Y') {
                if (arr[i + 4][j + 4] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 4][j + 4] += 500;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j - 1] += 500;
                }
            }
            //��������
            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == 'Y' && arr[i - 3][j + 3] == 'Y' &&
                arr[i - 4][j + 4] == '-' ||
                arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == 'Y' && arr[i - 3][j + 3] == 'Y' &&
                arr[i + 1][j - 1] == '-') {
                if (arr[i - 4][j + 4] == '-') {
                    singlePoint[i - 4][j + 4] += 500;
                } else {
                    singlePoint[i + 1][j - 1] += 500;
                }
            }
            //�жϺ������
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == 'Y') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i][j + 3] == '-') {
                    singlePoint[i][j + 3] += 500;
                } else if (arr[i][j + 1] == '-') {
                    singlePoint[i][j + 1] += 500;
                } else {
                    singlePoint[i][j + 2] += 500;
                }
            }
            //�ж��������
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i + 4][j] == 'Y') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 500;
                } else if (arr[i + 1][j] == '-') {
                    singlePoint[i + 1][j] += 500;
                } else {
                    singlePoint[i + 3][j] += 500;
                }
            }
            //�ж�б���������³���
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i + 4][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == '-' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == 'Y') {
                //�洢��Ӧ��ĵ÷�
                if (arr[i + 3][j + 3] == '-') {
                    singlePoint[i + 3][j + 3] += 500;
                } else if (arr[i + 1][j + 1] == '-') {
                    singlePoint[i + 1][j + 1] += 500;
                } else {
                    singlePoint[i + 2][j + 2] += 500;
                }
            }

            //б���������ϳ���
            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-' && arr[i - 3][j + 3] == 'Y' &&
                arr[i - 4][j + 4] == 'X' ||
                arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == 'Y' && arr[i - 3][j + 3] == '-' &&
                arr[i - 4][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'Y' && arr[i - 3][j + 3] == 'Y' &&
                arr[i - 4][j + 4] == 'Y') {
                if (arr[i - 2][j + 2] == '-') {
                    singlePoint[i - 2][j + 2] += 500;
                } else if (arr[i - 3][j + 3] == '-') {
                    singlePoint[i - 3][j + 3] += 500;
                } else {
                    singlePoint[i - 1][j + 1] += 500;
                }
            }
            //�жϻ��� -YYY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i][j + 3] += 250;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i][j - 1] += 250;
            }
            //�ж��������
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i + 3][j] += 250;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i - 1][j] += 250;
            }
            //�ж�б���������»���
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == '-') {
                //�洢��Ӧ��ĵ÷�
                singlePoint[i + 3][j + 3] += 250;
                //�洢��Ӧ��ĵ÷�
                singlePoint[i - 1][j - 1] += 250;
            }
            //б�����������»���
            if (arr[i][j] == 'Y' && arr[i + 1][j - 1] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-' &&
                arr[i + 2][j - 2] == '-' ){
                singlePoint[i -2][ j + 2] += 250;
                singlePoint[i + 2][ j -2] +=250;
            }
            //�жϺ������� YYY- || -YYY
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == 'X'  &&  arr[i][j + 4] == '-'||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' &&
                arr[i][j + 3] == 'X' && arr[i][j - 2] == '-') {
                if (arr[i][j + 3] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j + 3] += 90;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i][j - 1] += 90;
                }
            }
            //�ж���������
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == 'X' && arr[i + 4][j] == '-'||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' &&
                arr[i + 3][j] == 'X' && arr[ i -2][j] == '-') {
                if (arr[i + 3][j] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 3][j] += 90;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j] += 90;
                }
            }
            //�ж�б��������������
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == 'X' && arr[i + 4][ j+ 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                arr[i + 3][j + 3] == 'X' || arr[i - 2][ j - 2]=='-') {
                if (arr[i + 3][j + 3] == '-') {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i + 3][j + 3] += 90;
                } else {
                    //�洢��Ӧ��ĵ÷�
                    singlePoint[i - 1][j - 1] += 90;
                }
            }
            //�ж�б������������
            if(arr[i][j] == 'Y' && arr[i -1][j + 1] == 'Y' && arr[i - 2][j + 2] =='Y' && arr[i - 3][j + 3] =='X' && arr[i +1][j -1] =='-' && arr[i + 2][ j - 2] == '-' || arr[i][j] == 'Y' && arr[i -1][j + 1] == 'Y' && arr[i - 2][j + 2] =='Y' && arr[i - 3][j + 3] =='-' && arr[i +1][j -1] =='X' && arr[i -4][j + 4] == '-'){
                if(arr[i +1][j -1] =='-'){
                    singlePoint[i + 1][ j -1] +=90;
                } else{
                    singlePoint[i - 3][j + 3] +=90;
                }
            }

            //X-X����
            if (arr[i][j] == 'Y' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'Y') {
                singlePoint[i][j + 1] += 110;
            }
            //����
            if (arr[i][j] == 'Y' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'Y') {
                singlePoint[i + 1][j] += 110;
            }
            //б��
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'Y') {
                singlePoint[i + 1][j + 1] += 110;
            }
            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'Y') {
                singlePoint[i - 1][j + 1] += 110;
            }
            //������ -YY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j - 1] == '-') {
                singlePoint[i][j - 1] += 50;
                singlePoint[i][j + 2] += 50;

            }
            //������
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i - 1][j] == '-') {
                singlePoint[i - 1][j] += 50;
                singlePoint[i + 2][j] += 50;
            }
            //б����
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == '-') {
                singlePoint[i - 1][j - 1] += 50;
                singlePoint[i + 2][j + 2] += 50;

            }

            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-' && arr[i + 1][j - 1] == '-') {
                singlePoint[i - 2][j + 2] += 50;
                singlePoint[i + 1][j - 1] += 50;
            }
            //�����߶� YXX-|| YY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j - 1] == 'X' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'X') {
                if (arr[i][j + 2] == '-') {
                    singlePoint[i][j + 2] += 10;
                } else {
                    singlePoint[i][j - 1] += 10;
                }
            }
            //�����߶�
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i - 1][j] == 'X' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'X') {
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 10;
                } else {
                    singlePoint[i - 1][j] += 10;
                }
            }
            //б���߶�
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == 'X' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'X') {
                if (arr[i + 2][j + 2] == '-') {
                    singlePoint[i + 2][j + 2] += 10;
                } else {
                    singlePoint[i - 1][j - 1] += 10;
                }
            }
            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == 'X' && arr[i + 1][j - 1] == '-' ||
                arr[i][j] == 'Y' && arr[i + 1][j - 1 == 'X' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-']) {
                if (arr[i + 1][j - 1] == '-') {
                    singlePoint[i + 1][j - 1] += 10;
                } else {
                    singlePoint[i - 2][j + 2] += 10;
                }
            }
        }

    }
}

//Ѱ�����ֵ
void findMax(int points[LOW][LOW], char arr[LOW][LOW]) {
    //���Ƶ÷�����
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            points[i][j] = singlePoint[i][j];
        }
    }
    //����һ�����λ�ñ�ռ�����������²���
    int p = (LOW *LOW);
    int l = 0;
    again:
    max = 0;
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            if (points[i][j] > max) {
                max = points[i][j];
                single_low = i;
                single_row = j;
                l++;
            }
        }
    }
    if (arr[single_low][single_row] == 'X' || arr[single_low][single_row] == 'Y') {
        points[single_low][single_row] = 0;
        if (l > p) {
            return;
        }
        goto again;
    }

}

//�˻���������ѡ��λ������
int Single(char arr[LOW][LOW], int row, int col) {
    if (single_row < 0 || single_row >= LOW || single_low < 0 || single_low >= LOW) {

        return 0;
    }
    if (max != 0) {
        // ���������������滻���������Ӧ��λ��
        arr[single_low][single_row] = 'Y';
    } else {
        if (arr[row][col + 1] != '-') {
            arr[row][col - 1] = 'Y';
        }
        arr[row][col + 1] = 'Y';
    }
    return 0;
}

int main() {
    // �����û������������
    int row, col;
    // �����ͼ��С
    char arr[LOW][LOW];
    // �������
    char player = 'X';
    // ���������������ѭ�����ж�
    int che = 0;
    int validMove;

    //�洢���ֵ�����
    int points[LOW][LOW];
    // ��ʼ����ͼ
    Made_map(arr);
    //��ʼ�˵�
    printf("=====������====\n");
    printf("1.����ģʽ\n");
    printf("2.˫��ģʽ\n");
    printf("3.�˳���Ϸ\n");
    printf("������������������������������������\n�������ѡ��\n");
    scanf("%d", &decide);
    //����1���е���ģʽ
    if (decide == 1) {
        while (1) {
            play:
            //�����ͼ
            Print_map(arr);
            printf("���%c��ʼ�ж�: \n", player);
            validMove = 0;
            //���ݻغ����л�������X���껹��Y����
            int mm = 0;
            while (!validMove) {

                if (mm % 2 == 0) {
                    printf("����X������\n���س�ȷ��\n");
                } else {
                    printf("����Y������\n���س�ȷ��\n");
                }
                //�����ƶ������ж��Ƿ�������Чֵ
                validMove = Move(arr, player, row, col);
                if (!validMove) {
                    goto play;
                }
                ++mm;
            }
            //�������
            Clean();
            //���з�������
            DefensePoint(arr, singlePoint);
            //����������ߵĵ�
            findMax(points, arr);
            //����
            Single(arr, row, col);
            if (CheckWin(arr, player)) {
                // �������һ�ʤ��������Ϸ
                Print_map(arr);
                break;
            }
        }
    }
    //����2����˫��ģʽ
    if (decide == 2) {
        while (1) {
            // �����л�������ң��������aż�����b
            if (che % 2 == 0) {
                player = 'X';
            } else {
                player = 'Y';
            }

            Print_map(arr);
            printf("���%c��ʼ�ж�: \n", player);

            validMove = 0;
            while (!validMove) {

                scanf("%d %d", &row, &col);
                validMove = Move(arr, player, row, col);
            }

            if (CheckWin(arr, player)) {
                // �������һ�ʤ��������Ϸ
                Print_map(arr);
                break;
            }
            che++;
        }
    }
    //������3ʱ�˳���Ϸ
    if (decide == 3) {
        return 0;
    }
}

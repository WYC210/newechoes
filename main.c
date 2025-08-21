
#include <stdio.h>
//进行输入是否为数字进行判断

#define LOW 15
//存储人机棋盘的评分
int singlePoint[LOW][LOW];
int single_low = 0;//横
int single_row = 0;//纵
int max = 0;//定义存储最大评分

//判断选的模式
int decide = 0;

// 实现初始化地图
void Made_map(char arr[LOW][LOW]) {
    // 初始化地图
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            arr[i][j] = '-';
        }
    }
}

// 实现输出地图
void Print_map(char arr[LOW][LOW]) {
    printf("    ");
    for (int i = 0; i < LOW; i++) {
        if (i < 10) //输出第几行
        {
            printf(" %d  ", i);
        } else {
            printf("%d  ", i);
        }
    }
    printf("\n");
    for (int i = 0; i < LOW; i++)//输出棋盘竖列
    {
        if (i < 10) //输出第几行
        {
            printf(" %d", i);
        } else {
            printf("%d", i);
        }
        for (int j = 0; j < LOW; j++) //输出棋盘横排
        {
            printf("   %c", arr[i][j]);
        }
        if (i < 10) //输出第几行
        {
            printf("   %d", i);
        } else {
            printf("   %d", i);
        }
        printf("\n");//输出完每一排换行
    }
    printf("    ");
    for (int i = 0; i < LOW; i++) {
        if (i < 10) //输出第几行
        {
            printf(" %d  ", i);
        } else {
            printf("%d  ", i);
        }
    }
    printf("\n");
}

//清理缓存
void clearPoint() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

// 实现玩家下棋移动
int Move(char arr[LOW][LOW], char player, int row, int col) {
    // 异常处理
    if (scanf("%d %d", &row, &col) != 2) {
        printf("******************\n 无效的输入，请重新输入 \n******************\n");
        //清理缓存
        clearPoint();
        return 0;
    }
    if (row < 0 || row >= LOW || col < 0 || col >= LOW || arr[row][col] != '-') {
        printf("******************\n 无效的输入，请重新输入 \n******************\n");
        //清理缓存
        clearPoint();
        return 0;
    }
    // 将玩家输入的坐标替换成数组里对应的位置
    arr[row][col] = player;
    return 1;
}

//查找是否胜利
int CheckWin(char arr[LOW][LOW], char player) {
    //人人检查
    if (decide != 1) {
        //检查横向
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == player && arr[i][j + 1] == player && arr[i][j + 2] == player &&
                    arr[i][j + 3] == player &&
                    arr[i][j + 4] == player) {
                    printf("===================\n%c胜利!\n===================\n", player);
                    return 1;
                }
            }
        }

        // 检查纵向
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[j][i] == player && arr[j + 1][i] == player && arr[j + 2][i] == player &&
                    arr[j + 3][i] == player &&
                    arr[j + 4][i] == player) {
                    printf("===================\n%c胜利!\n===================\n", player);
                    return 1;
                }
            }
        }

        // 检查斜向（左上到右下）
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == player && arr[i + 1][j + 1] == player && arr[i + 2][j + 2] == player &&
                    arr[i + 3][j + 3] == player && arr[i + 4][j + 4] == player) {
                    printf("===================\n%x胜利!\n===================\n", player);
                    return 1;
                }
            }
        }

        // 检查斜向（右上到左下）
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 4; j < LOW; j++) {
                if (arr[i][j] == player && arr[i + 1][j - 1] == player && arr[i + 2][j - 2] == player &&
                    arr[i + 3][j - 3] == player && arr[i + 4][j - 4] == player) {
                    printf("===================\n%c胜利!\n===================\n", player);
                    return 1;
                }
            }
        }
    }
    //人机检查
    if (decide == 1) {
        //检查横向
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                    arr[i][j + 4] == 'Y') {
                    printf("===================\n人机胜利!\n===================\n");
                    return 1;
                }
            }
        }

        // 检查纵向
        for (int i = 0; i < LOW; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[j][i] == 'Y' && arr[j + 1][i] == 'Y' && arr[j + 2][i] == 'Y' && arr[j + 3][i] == 'Y' &&
                    arr[j + 4][i] == 'Y') {
                    printf("===================\n人机胜利!\n===================\n");
                    return 1;
                }
            }
        }

        // 检查斜向（左上到右下）
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 0; j < LOW - 4; j++) {
                if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                    arr[i + 3][j + 3] == 'Y' && arr[i + 4][j + 4] == 'Y') {
                    printf("===================\n人机胜利!\n===================\n");
                    return 1;
                }
            }
        }

        // 检查斜向（右上到左下）
        for (int i = 0; i < LOW - 4; i++) {
            for (int j = 4; j < LOW; j++) {
                if (arr[i][j] == 'Y' && arr[i + 1][j - 1] == 'Y' && arr[i + 2][j - 2] == 'Y' &&
                    arr[i + 3][j - 3] == 'Y' && arr[i + 4][j - 4] == 'Y') {
                    printf("===================\n人机胜利!\n===================\n");
                    return 1;
                }
            }
        }
    }
    return 0;

}
/*
 * 连五，活四，冲四，活三，眠三，活二，眠二
 */

//清理数组中的缓存
void Clean() {
    for (int i = 0; i < 15; ++i) {
        for (int j = 0; j < 15; ++j) {
            singlePoint[i][j] = 0;
        }
    }
}

//攻击,防御评分
void DefensePoint(char arr[LOW][LOW], int singlePoint[LOW][LOW]) {
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            //判断横向活四 YYYY- ||-YYYY
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == '-' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' &&
                arr[i][j + 3] == 'X') {
                if (arr[i][j + 4] == '-') {
                    //存储对应点的得分
                    singlePoint[i][j + 4] += 400;
                } else {
                    //存储对应点的得分
                    singlePoint[i][j - 1] += 400;
                }
            }
            //判断竖向活四
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == '-' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' &&
                arr[i + 3][j] == 'X') {
                if (arr[i + 4][j] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 4][j] += 400;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j] += 400;
                }
            }
            //判断斜向右上左下活四
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' &&
                arr[i + 3][j + 3] == 'X') {
                if (arr[i + 4][j + 4] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 4][j + 4] += 400;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j - 1] += 400;
                }
            }
            //左上右下
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
            //判断横向活四
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'X' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j + 3] == 'X' &&
                arr[i][j + 4] == 'X') {
                //存储对应点的得分
                if (arr[i][j + 3] == '-') {
                    singlePoint[i][j + 3] += 400;
                } else if (arr[i][j + 1] == '-') {
                    singlePoint[i][j + 1] += 400;
                } else {
                    singlePoint[i][j + 2] += 400;
                }
            }
            //判断竖向冲四
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'X' && arr[i + 3][j] == 'X' &&
                arr[i + 4][j] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i + 4][j] == 'X') {
                //存储对应点的得分
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 400;
                } else if (arr[i + 1][j] == '-') {
                    singlePoint[i + 1][j] += 400;
                } else {
                    singlePoint[i + 3][j] += 400;
                }
            }
            //判断斜向左上右下冲四
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i + 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == '-' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == 'X' ||
                arr[i][j] == 'X' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == 'X' &&
                arr[i + 4][j + 4] == 'X') {
                //存储对应点的得分
                if (arr[i + 3][j + 3] == '-') {
                    singlePoint[i + 3][j + 3] += 400;
                } else if (arr[i + 1][j + 1] == '-') {
                    singlePoint[i + 1][j + 1] += 400;
                } else {
                    singlePoint[i + 2][j + 2] += 400;
                }
            }

            //斜向右下左上冲四
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
            //判断活三 -YYY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == '-') {
                //存储对应点的得分
                singlePoint[i][j + 3] += 200;
                //存储对应点的得分
                singlePoint[i][j - 1] += 200;
            }
            //判断竖向活三
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == '-') {
                //存储对应点的得分
                singlePoint[i + 3][j] += 200;
                //存储对应点的得分
                singlePoint[i - 1][j] += 200;
            }
            //判断斜向左上右下活三
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == '-') {
                //存储对应点的得分
                singlePoint[i + 3][j + 3] += 200;
                //存储对应点的得分
                singlePoint[i - 1][j - 1] += 200;
            }
            //斜向下右上左下活三
            if (arr[i][j] == 'X' && arr[i + 1][j - 1] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-' &&
                arr[i + 2][j - 2] == '-' ){
                singlePoint[i -2][ j + 2] += 200;
                singlePoint[i + 2][ j -2] +=200;
            }
            //判断横向眠三 YYY- || -YYY
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == 'Y' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'X' &&
                arr[i][j + 3] == 'Y') {
                if (arr[i][j + 3] == '-') {
                    //存储对应点的得分
                    singlePoint[i][j + 3] += 80;
                } else {
                    //存储对应点的得分
                    singlePoint[i][j - 1] += 80;
                }
            }
            //判断竖向眠三
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == 'Y' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'X' &&
                arr[i + 3][j] == 'Y') {
                if (arr[i + 3][j] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 3][j] += 80;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j] += 80;
                }
            }
            //判断斜左上右下向眠三
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == 'Y' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == 'X' &&
                arr[i + 3][j + 3] == 'Y') {
                if (arr[i + 3][j + 3] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 3][j + 3] += 80;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j - 1] += 80;
                }
            }
            //判断斜右上左下眠三
            if(arr[i][j] == 'X' && arr[i -1][j + 1] == 'X' && arr[i - 2][j + 2] =='X' && arr[i - 3][j + 3] =='Y' && arr[i +1][j -1] =='-' || arr[i][j] == 'X' && arr[i -1][j + 1] == 'X' && arr[i - 2][j + 2] =='X' && arr[i - 3][j + 3] =='-' && arr[i +1][j -1] =='Y'){
                if(arr[i +1][j -1] =='-'){
                    singlePoint[i + 1][ j -1] +=80;
                } else{
                    singlePoint[i - 3][j + 3] +=80;
                }
            }

            //X-X横向
            if (arr[i][j] == 'X' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'X') {
                singlePoint[i][j + 1] += 100;
            }
            //竖向
            if (arr[i][j] == 'X' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'X') {
                singlePoint[i + 1][j] += 100;
            }
            //斜向
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'X') {
                singlePoint[i + 1][j+ 1] += 100;
            }
            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'X') {
                singlePoint[i - 1][j + 1] += 100;
            }
            //横向活二 -YY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j - 1] == '-') {
                singlePoint[i][j - 1] += 40;
                singlePoint[i][j + 2] += 40;

            }
            //竖向活二
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i - 1][j] == '-') {
                singlePoint[i - 1][j] += 40;
                singlePoint[i + 2][j] += 40;
            }
            //斜向活二
            if (arr[i][j] == 'X' && arr[i + 1][j + 1] == 'X' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == '-') {
                singlePoint[i - 1][j - 1] += 40;
                singlePoint[i + 2][j + 2] += 40;

            }

            if (arr[i][j] == 'X' && arr[i - 1][j + 1] == 'X' && arr[i - 2][j + 2] == '-' && arr[i + 1][j - 1] == '-') {
                singlePoint[i - 2][j + 2] += 40;
                singlePoint[i + 1][j - 1] += 40;
            }
            //横向眠二 YXX-|| YY-
            if (arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == '-' && arr[i][j - 1] == 'Y' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'X' && arr[i][j + 1] == 'X' && arr[i][j + 2] == 'Y') {
                if (arr[i][j + 2] == '-') {
                    singlePoint[i][j + 2] += 5;
                } else {
                    singlePoint[i][j - 1] += 5;
                }
            }
            //竖向眠二
            if (arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == '-' && arr[i - 1][j] == 'Y' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'X' && arr[i + 1][j] == 'X' && arr[i + 2][j] == 'Y') {
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 5;
                } else {
                    singlePoint[i - 1][j] += 5;
                }
            }
            //斜向眠二
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
            //-------------------------------------------------------进攻---------------------------------------------
            //判断横向活四 YYYY- ||-YYYY
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == '-'  ||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' &&
                arr[i][j + 3] == 'Y') {
                if (arr[i][j + 4] == '-') {
                    //存储对应点的得分
                    singlePoint[i][j + 4] += 500;
                } else {
                    //存储对应点的得分
                    singlePoint[i][j - 1] += 500;
                }
            }
            //判断竖向活四
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == '-' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' &&
                arr[i + 3][j] == 'Y') {
                if (arr[i + 4][j] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 4][j] += 500;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j] += 500;
                }
            }
            //判断斜向右上左下活四
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                arr[i + 3][j + 3] == 'Y') {
                if (arr[i + 4][j + 4] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 4][j + 4] += 500;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j - 1] += 500;
                }
            }
            //左上右下
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
            //判断横向活四
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j + 3] == 'Y' &&
                arr[i][j + 4] == 'Y') {
                //存储对应点的得分
                if (arr[i][j + 3] == '-') {
                    singlePoint[i][j + 3] += 500;
                } else if (arr[i][j + 1] == '-') {
                    singlePoint[i][j + 1] += 500;
                } else {
                    singlePoint[i][j + 2] += 500;
                }
            }
            //判断竖向冲四
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == 'Y' &&
                arr[i + 4][j] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i + 4][j] == 'Y') {
                //存储对应点的得分
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 500;
                } else if (arr[i + 1][j] == '-') {
                    singlePoint[i + 1][j] += 500;
                } else {
                    singlePoint[i + 3][j] += 500;
                }
            }
            //判断斜向左上右下冲四
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i + 4][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == '-' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == 'Y' ||
                arr[i][j] == 'Y' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == 'Y' &&
                arr[i + 4][j + 4] == 'Y') {
                //存储对应点的得分
                if (arr[i + 3][j + 3] == '-') {
                    singlePoint[i + 3][j + 3] += 500;
                } else if (arr[i + 1][j + 1] == '-') {
                    singlePoint[i + 1][j + 1] += 500;
                } else {
                    singlePoint[i + 2][j + 2] += 500;
                }
            }

            //斜向右下左上冲四
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
            //判断活三 -YYY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == '-') {
                //存储对应点的得分
                singlePoint[i][j + 3] += 250;
                //存储对应点的得分
                singlePoint[i][j - 1] += 250;
            }
            //判断竖向活三
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == '-') {
                //存储对应点的得分
                singlePoint[i + 3][j] += 250;
                //存储对应点的得分
                singlePoint[i - 1][j] += 250;
            }
            //判断斜向左上右下活三
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == '-') {
                //存储对应点的得分
                singlePoint[i + 3][j + 3] += 250;
                //存储对应点的得分
                singlePoint[i - 1][j - 1] += 250;
            }
            //斜向下右上左下活三
            if (arr[i][j] == 'Y' && arr[i + 1][j - 1] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-' &&
                arr[i + 2][j - 2] == '-' ){
                singlePoint[i -2][ j + 2] += 250;
                singlePoint[i + 2][ j -2] +=250;
            }
            //判断横向眠三 YYY- || -YYY
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' && arr[i][j + 3] == '-' &&
                arr[i][j - 1] == 'X'  &&  arr[i][j + 4] == '-'||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'Y' &&
                arr[i][j + 3] == 'X' && arr[i][j - 2] == '-') {
                if (arr[i][j + 3] == '-') {
                    //存储对应点的得分
                    singlePoint[i][j + 3] += 90;
                } else {
                    //存储对应点的得分
                    singlePoint[i][j - 1] += 90;
                }
            }
            //判断竖向眠三
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' && arr[i + 3][j] == '-' &&
                arr[i - 1][j] == 'X' && arr[i + 4][j] == '-'||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'Y' &&
                arr[i + 3][j] == 'X' && arr[ i -2][j] == '-') {
                if (arr[i + 3][j] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 3][j] += 90;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j] += 90;
                }
            }
            //判断斜左上右下向眠三
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' && arr[i + 3][j + 3] == '-' &&
                arr[i - 1][j - 1] == 'X' && arr[i + 4][ j+ 4] == '-' ||
                arr[i - 1][j - 1] == '-' && arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == 'Y' &&
                arr[i + 3][j + 3] == 'X' || arr[i - 2][ j - 2]=='-') {
                if (arr[i + 3][j + 3] == '-') {
                    //存储对应点的得分
                    singlePoint[i + 3][j + 3] += 90;
                } else {
                    //存储对应点的得分
                    singlePoint[i - 1][j - 1] += 90;
                }
            }
            //判断斜右上左下眠三
            if(arr[i][j] == 'Y' && arr[i -1][j + 1] == 'Y' && arr[i - 2][j + 2] =='Y' && arr[i - 3][j + 3] =='X' && arr[i +1][j -1] =='-' && arr[i + 2][ j - 2] == '-' || arr[i][j] == 'Y' && arr[i -1][j + 1] == 'Y' && arr[i - 2][j + 2] =='Y' && arr[i - 3][j + 3] =='-' && arr[i +1][j -1] =='X' && arr[i -4][j + 4] == '-'){
                if(arr[i +1][j -1] =='-'){
                    singlePoint[i + 1][ j -1] +=90;
                } else{
                    singlePoint[i - 3][j + 3] +=90;
                }
            }

            //X-X横向
            if (arr[i][j] == 'Y' && arr[i][j + 1] == '-' && arr[i][j + 2] == 'Y') {
                singlePoint[i][j + 1] += 110;
            }
            //竖向
            if (arr[i][j] == 'Y' && arr[i + 1][j] == '-' && arr[i + 2][j] == 'Y') {
                singlePoint[i + 1][j] += 110;
            }
            //斜向
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == '-' && arr[i + 2][j + 2] == 'Y') {
                singlePoint[i + 1][j + 1] += 110;
            }
            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == '-' && arr[i - 2][j + 2] == 'Y') {
                singlePoint[i - 1][j + 1] += 110;
            }
            //横向活二 -YY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j - 1] == '-') {
                singlePoint[i][j - 1] += 50;
                singlePoint[i][j + 2] += 50;

            }
            //竖向活二
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i - 1][j] == '-') {
                singlePoint[i - 1][j] += 50;
                singlePoint[i + 2][j] += 50;
            }
            //斜向活二
            if (arr[i][j] == 'Y' && arr[i + 1][j + 1] == 'Y' && arr[i + 2][j + 2] == '-' && arr[i - 1][j - 1] == '-') {
                singlePoint[i - 1][j - 1] += 50;
                singlePoint[i + 2][j + 2] += 50;

            }

            if (arr[i][j] == 'Y' && arr[i - 1][j + 1] == 'Y' && arr[i - 2][j + 2] == '-' && arr[i + 1][j - 1] == '-') {
                singlePoint[i - 2][j + 2] += 50;
                singlePoint[i + 1][j - 1] += 50;
            }
            //横向眠二 YXX-|| YY-
            if (arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == '-' && arr[i][j - 1] == 'X' ||
                arr[i][j - 1] == '-' && arr[i][j] == 'Y' && arr[i][j + 1] == 'Y' && arr[i][j + 2] == 'X') {
                if (arr[i][j + 2] == '-') {
                    singlePoint[i][j + 2] += 10;
                } else {
                    singlePoint[i][j - 1] += 10;
                }
            }
            //竖向眠二
            if (arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == '-' && arr[i - 1][j] == 'X' ||
                arr[i - 1][j] == '-' && arr[i][j] == 'Y' && arr[i + 1][j] == 'Y' && arr[i + 2][j] == 'X') {
                if (arr[i + 2][j] == '-') {
                    singlePoint[i + 2][j] += 10;
                } else {
                    singlePoint[i - 1][j] += 10;
                }
            }
            //斜向眠二
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

//寻找最大值
void findMax(int points[LOW][LOW], char arr[LOW][LOW]) {
    //复制得分数组
    for (int i = 0; i < LOW; i++) {
        for (int j = 0; j < LOW; j++) {
            points[i][j] = singlePoint[i][j];
        }
    }
    //当第一大的数位置被占用则依次往下查找
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

//人机根据评分选择位置下棋
int Single(char arr[LOW][LOW], int row, int col) {
    if (single_row < 0 || single_row >= LOW || single_low < 0 || single_low >= LOW) {

        return 0;
    }
    if (max != 0) {
        // 将玩家输入的坐标替换成数组里对应的位置
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
    // 定义用户输入的行与列
    int row, col;
    // 定义地图大小
    char arr[LOW][LOW];
    // 定义玩家
    char player = 'X';
    // 定义两个玩家来回循环的判定
    int che = 0;
    int validMove;

    //存储评分的数组
    int points[LOW][LOW];
    // 初始化地图
    Made_map(arr);
    //开始菜单
    printf("=====五子棋====\n");
    printf("1.单人模式\n");
    printf("2.双人模式\n");
    printf("3.退出游戏\n");
    printf("——————————————————\n输入你的选择\n");
    scanf("%d", &decide);
    //输入1进行单人模式
    if (decide == 1) {
        while (1) {
            play:
            //输出地图
            Print_map(arr);
            printf("玩家%c开始行动: \n", player);
            validMove = 0;
            //根据回合数切换是输入X坐标还是Y坐标
            int mm = 0;
            while (!validMove) {

                if (mm % 2 == 0) {
                    printf("输入X轴坐标\n按回车确定\n");
                } else {
                    printf("输入Y轴坐标\n按回车确定\n");
                }
                //进行移动，并判定是否输入有效值
                validMove = Move(arr, player, row, col);
                if (!validMove) {
                    goto play;
                }
                ++mm;
            }
            //清除评分
            Clean();
            //进行防御评分
            DefensePoint(arr, singlePoint);
            //查找评分最高的点
            findMax(points, arr);
            //下棋
            Single(arr, row, col);
            if (CheckWin(arr, player)) {
                // 如果有玩家获胜，结束游戏
                Print_map(arr);
                break;
            }
        }
    }
    //输入2进行双人模式
    if (decide == 2) {
        while (1) {
            // 来回切换两个玩家，奇数玩家a偶数玩家b
            if (che % 2 == 0) {
                player = 'X';
            } else {
                player = 'Y';
            }

            Print_map(arr);
            printf("玩家%c开始行动: \n", player);

            validMove = 0;
            while (!validMove) {

                scanf("%d %d", &row, &col);
                validMove = Move(arr, player, row, col);
            }

            if (CheckWin(arr, player)) {
                // 如果有玩家获胜，结束游戏
                Print_map(arr);
                break;
            }
            che++;
        }
    }
    //当输入3时退出游戏
    if (decide == 3) {
        return 0;
    }
}

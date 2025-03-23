/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [  
  // 린트 대상 파일 지정
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],  // Typescript, Vue 파일들을 검사
  },
  //무시할 파일/폴더 지정
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],//빌드, 테스트 결과
  },
  //vue 와 ts 관련 설정 적용
  ...pluginVue.configs['flat/recommended'], //vue 린트 설정
  ...vueTsEslintConfig(),//ts 린트 설정

  // 커스텀 규칙
  {
    rules: {
      // 사용되지 않는 표현식 관련 규칙
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,//단축 평가 허용
          allowTernary: true,//삼항 연산자 허용
        },
      ],
      'vue/multi-word-component-names': 'true',//vue 컴포넌트 이름 규칙 활성화 : HTML 기본 태그와의 충돌 방지, 컴포넌트의 목적을 더 명확하게 표현, 네이밍 컨벤션의 일관성 유지를 위해
    }
  }
]

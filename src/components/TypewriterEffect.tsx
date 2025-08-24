import React, { useState, useEffect, useRef } from 'react';

interface TypewriterEffectProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  startDelay?: number;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  className = '',
  typingSpeed = 200,
  deletingSpeed = 80,
  pauseTime = 2000,
  startDelay = 800
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // 清理之前的状态
    setDisplayText('');
    setIsDeleting(false);
    setCurrentIndex(0);
    setIsStarted(false);

    // 清理之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // 延迟开始打字机效果
    const startTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setIsStarted(true);
      }
    }, startDelay);

    return () => {
      isMountedRef.current = false;
      clearTimeout(startTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, startDelay]);

  useEffect(() => {
    if (!isStarted || !isMountedRef.current) return;

    let localIndex = 0;
    let localIsDeleting = false;

    const typeLoop = () => {
      if (!isMountedRef.current) return;

      if (!localIsDeleting && localIndex < text.length) {
        // 打字阶段
        localIndex++;
        setDisplayText(text.substring(0, localIndex));
        setCurrentIndex(localIndex);
        timeoutRef.current = window.setTimeout(typeLoop, typingSpeed);
      } else if (!localIsDeleting && localIndex === text.length) {
        // 打字完成，等待一段时间后开始删除
        timeoutRef.current = window.setTimeout(() => {
          if (isMountedRef.current) {
            localIsDeleting = true;
            setIsDeleting(true);
            typeLoop();
          }
        }, pauseTime);
      } else if (localIsDeleting && localIndex > 0) {
        // 删除阶段
        localIndex--;
        setDisplayText(text.substring(0, localIndex));
        setCurrentIndex(localIndex);
        timeoutRef.current = window.setTimeout(typeLoop, deletingSpeed);
      } else if (localIsDeleting && localIndex === 0) {
        // 删除完成，等待一段时间后重新开始打字
        localIsDeleting = false;
        setIsDeleting(false);
        timeoutRef.current = window.setTimeout(typeLoop, 1000);
      }
    };

    typeLoop();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isStarted, text, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={`typewriter-container ${className}`}>
      {displayText}
      {isStarted && <span className="typewriter-cursor">|</span>}
    </span>
  );
};

export default TypewriterEffect;

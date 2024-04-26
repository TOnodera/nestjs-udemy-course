FROM node:14


RUN npm i -g @nestjs/cli@8.1.1
USER node

CMD ["sleep", "infinity"]
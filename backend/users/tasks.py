from celery import shared_task


@shared_task(bind=True)
def add(x, y):
    return x + y
